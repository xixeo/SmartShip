package com.lead.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lead.dto.ItemRecommendDTO;
import com.lead.dto.ItemsDTO;
import com.lead.entity.Category3;
import com.lead.entity.Items;
import com.lead.entity.Leadtime;
import com.lead.repository.Category3Repo;
import com.lead.repository.ItemsRepo;
import com.lead.repository.LeadtimeRepo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
public class ItemsService {

	@Autowired
	private ItemsRepo itemsRepo;

	@PersistenceContext
	private EntityManager entityManager;

	@Autowired
	private LeadtimeRepo leadtimeRepo;

	@Autowired
	private Category3Repo category3Repo;

	/////////////////////////////////////////////////////////////////////////////////// 전체
	/////////////////////////////////////////////////////////////////////////////////// 상품
	/////////////////////////////////////////////////////////////////////////////////// 조회
	/////////////////////////////////////////////////////////////////////////////////// ROLE.SUPPLIER
	/////////////////////////////////////////////////////////////////////////////////// 입장
	/////////////////////////////////////////////////////////////////////////////////// /
	/////////////////////////////////////////////////////////////////////////////////// ROLE.USER
	/////////////////////////////////////////////////////////////////////////////////// 입장
	@Transactional(readOnly = true)
	public List<ItemsDTO> findItemsByRole(String category1Name, String category2Name, String category3Name,
			String itemName) {

		// JWT 토큰에서 사용자 정보 추출 (SecurityContextHolder)
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName(); // 토큰에서 username 추출
		String role = authentication.getAuthorities().stream().findFirst()
				.orElseThrow(() -> new RuntimeException("권한 정보를 찾을 수 없습니다.")).getAuthority(); // role 추출

		// 영속성 컨텍스트 강제 초기화 (flush() 및 clear() 호출) -- 조회가 여러번 타서 넣음
		entityManager.flush();
		entityManager.clear();

		Specification<Items> spec = (root, query, builder) -> {

			// enabled 필터링 - 판매자가 삭제한 상품
			// Predicate enabledPredicate = builder.isTrue(root.get("enabled")); // enabled
			// = true인 항목만 조회

			// ROLE 따른 필터링
			if (role.equals("ROLE_SUPPLIER")) {
				// ROLE_SUPPLIER: username으로 필터링하여 자신의 물품만 조회
				return builder.and(builder.equal(root.join("member").get("username"), username),
						builder.equal(root.get("enabled"), true), // 삭제 된 상품 필터링
						createCommonFilters(root, builder, category1Name, category2Name, category3Name, itemName));
			} else {
				// ROLE_USER: 모든 물품 조회
				return builder.and(builder.equal(root.get("enabled"), true), // 삭제 된 상품 필터링
						builder.equal(root.get("forSale"), true), // 판매 중인 상품만 필터링
						createCommonFilters(root, builder, category1Name, category2Name, category3Name, itemName));
			}
		};

		// JpaSpecificationExecutor의 findAll을 사용하여 필터링된 결과 조회
		List<Items> items = itemsRepo.findAll(spec);
		// return items.stream().map(this::convertToDto).collect(Collectors.toList());
		// 역할에 따라 DTO 변환
		if (role.equals("ROLE_SUPPLIER")) {
			return items.stream().map(this::convertToDtoWithEnabled).collect(Collectors.toList());
		} else {
			return items.stream().map(this::convertToDtoWithoutEnabled).collect(Collectors.toList());
		}
	}

	private Predicate createCommonFilters(Root<Items> root, CriteriaBuilder builder, String category1Name,
			String category2Name, String category3Name, String itemName) {
		return builder.and(
				category1Name != null && !category1Name.isEmpty()
						? builder.equal(root.join("category3").join("category2").join("category1").get("categoryName"),
								category1Name)
						: builder.conjunction(),

				category2Name != null && !category2Name.isEmpty()
						? builder.equal(root.join("category3").join("category2").get("category2Name"), category2Name)
						: builder.conjunction(),

				category3Name != null && !category3Name.isEmpty()
						? builder.equal(root.join("category3").get("category3Name"), category3Name)
						: builder.conjunction(),

				itemName != null && !itemName.isEmpty() ? builder.like(root.get("itemName"), "%" + itemName + "%")
						: builder.conjunction());
	}

	private ItemsDTO convertToDtoWithEnabled(Items item) {

		// Leadtime 정보 조회
		Leadtime leadtime = leadtimeRepo.findByItems_ItemsId(item.getItemsId())
				.orElseThrow(() -> new RuntimeException("리드타임 정보가 없습니다."));

		return ItemsDTO.builder().itemId(item.getItemsId()).itemName(item.getItemName())
				.category1Name(item.getCategory3().getCategory2().getCategory1().getCategoryName())
				.category2Name(item.getCategory3().getCategory2().getCategory2Name())
				.category3Name(item.getCategory3().getCategory3Name()).part1(item.getPart1()).part2(item.getPart2())
				.price(item.getPrice()).unit(item.getUnit()).supplierName(item.getMember().getUsername())
				.alias(item.getMember().getAlias()).leadtime(leadtime.getLeadtime()).forSale(item.isForSale()).build();
	}

	private ItemsDTO convertToDtoWithoutEnabled(Items item) {

		// Leadtime 정보 조회
		Leadtime leadtime = leadtimeRepo.findByItems_ItemsId(item.getItemsId())
				.orElseThrow(() -> new RuntimeException("리드타임 정보가 없습니다."));

		return ItemsDTO.builder().itemId(item.getItemsId()).itemName(item.getItemName())
				.category1Name(item.getCategory3().getCategory2().getCategory1().getCategoryName())
				.category2Name(item.getCategory3().getCategory2().getCategory2Name())
				.category3Name(item.getCategory3().getCategory3Name()).part1(item.getPart1()).part2(item.getPart2())
				.price(item.getPrice()).unit(item.getUnit()).supplierName(item.getMember().getUsername())
				.alias(item.getMember().getAlias()).leadtime(leadtime.getLeadtime()).build();
	}

	/////////////////////////////////////////////////////////////////////////////////// 상품
	/////////////////////////////////////////////////////////////////////////////////// 등록

	/////////////////////////////////////////////////////////////////////////////////// 상품
	/////////////////////////////////////////////////////////////////////////////////// 수정
	@Transactional
	 // 아이템 수정 로직
	  // 아이템 수정 로직
    public ItemsDTO updateItem(Integer itemId, ItemsDTO updatedItemDto, String username) {
        // 현재 로그인한 사용자 확인
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

     // 수정할 아이템 찾기
        Items item = itemsRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        // category3Name을 통해 Category3 엔티티 찾기
        Category3 category3 = category3Repo.findByCategory3Name(updatedItemDto.getCategory3Name())
                .orElseThrow(() -> new RuntimeException("Category3 not found"));

		// 현재 사용자(공급자)가 이 물품의 소유자인지 확인
		if (!item.getMember().getUsername().equals(username)) {
			throw new RuntimeException("해당 물품을 수정할 권한이 없습니다.");
		}

        // 아이템 정보 업데이트
		 item.setCategory3(category3);
        item.setItemName(updatedItemDto.getItemName());
        item.setPart1(updatedItemDto.getPart1());
        item.setPart2(updatedItemDto.getPart2());
        item.setPrice(updatedItemDto.getPrice());
        item.setUnit(updatedItemDto.getUnit());
        item.setForSale(updatedItemDto.isForSale());

        itemsRepo.save(item);

        return convertToDto(item);
    }

    // Entity를 DTO로 변환하는 메소드
    private ItemsDTO convertToDto(Items item) {
        return ItemsDTO.builder()
        		.category3Name(item.getCategory3().getCategory3Name())
                .itemId(item.getItemsId())
                .itemName(item.getItemName())
                .part1(item.getPart1())
                .part2(item.getPart2())
                .price(item.getPrice())
                .unit(item.getUnit())
                .forSale(item.isForSale()) 
                .build();
    }

	/////////////////////////////////////////////////////////////////////////////////// 상품
	/////////////////////////////////////////////////////////////////////////////////// 삭제
	@Transactional
	public void deleteItem(Integer itemId, String username) {

		// itemId로 물품 조회
		Items item = itemsRepo.findById(itemId).orElseThrow(() -> new RuntimeException("해당 물품을 찾을 수 없습니다."));

		// 현재 사용자(공급자)가 이 물품의 소유자인지 확인
		if (!item.getMember().getUsername().equals(username)) {
			throw new RuntimeException("해당 물품을 수정할 권한이 없습니다.");
		}

		// 물품을 비활성화 처리 (enabled = 0)
		item.setEnabled(false); // boolean 값을 설정하면 DB에서 TINYINT로 처리
		itemsRepo.save(item);
	}

	/////////////////////////////////////////////////////////////////////////////////// 대체
	/////////////////////////////////////////////////////////////////////////////////// 상품
	/////////////////////////////////////////////////////////////////////////////////// 조회
	public List<ItemRecommendDTO> getRecommendedItems(Integer selectedItemId, LocalDate releaseDate) {
		List<Object[]> results = itemsRepo.findAlternativeItems(selectedItemId, releaseDate.toString());

		return results.stream().map(result -> {
			ItemRecommendDTO dto = new ItemRecommendDTO();
			dto.setItemsId((Integer) result[0]); // itemsId
			dto.setItemName((String) result[1]); // itemName
			dto.setPrice((BigDecimal) result[2]); // price
			dto.setLeadtime((Integer) result[3]); // leadtime
			return dto;
		}).collect(Collectors.toList());
	}

	/////////////////////////////////////////////////////////////////////////////////// 판매된
	/////////////////////////////////////////////////////////////////////////////////// 상품
	/////////////////////////////////////////////////////////////////////////////////// 카운트
	@Transactional
	public void incrementPurchaseCount(Integer itemsId) {
		itemsRepo.incrementPurchaseCount(itemsId);
	}
}
