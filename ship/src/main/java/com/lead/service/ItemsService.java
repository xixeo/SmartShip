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
import com.lead.entity.Member;
import com.lead.repository.Category3Repo;
import com.lead.repository.ItemsRepo;
import com.lead.repository.LeadtimeRepo;
import com.lead.repository.MemberRepo;

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
	private MemberRepo memberRepo;

//	@Autowired
//	private Category1Repo category1Repo;
//
//	@Autowired
//	private Category2Repo category2Repo;

	@Autowired
	private Category3Repo category3Repo;

	/////////////////////////////////////////////////////////////////////////////////// 전체상품조회ROLE.SUPPILER/ROLE.USER입장
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
	public void addItem(ItemsDTO itemsDTO, String username, Authentication authentication) {

		// 현재 사용자(공급자)가 이 물품의 소유자인지 확인
		if (authentication.getAuthorities().stream().noneMatch(auth -> auth.getAuthority().equals("ROLE_SUPPLIER"))) {
			throw new RuntimeException("물품 등록 권한이 없습니다.");
		}

		// 필수 입력값 확인
		if (itemsDTO.getCategory1Name() == null || itemsDTO.getCategory2Name() == null
				|| itemsDTO.getCategory3Name() == null || itemsDTO.getItemName() == null || itemsDTO.getPart1() == null
				|| itemsDTO.getPrice() == null || itemsDTO.getUnit() == null || itemsDTO.getLeadtime() == null) {
			throw new RuntimeException("필수 입력값을 모두 입력해 주세요.");
		}

		// supplierName 설정
		itemsDTO.setSupplierName(username);

		// Member 조회 (supplierName을 통해)
		Member member = memberRepo.findByUsername(itemsDTO.getSupplierName())
				.orElseThrow(() -> new RuntimeException("해당 공급자를 찾을 수 없습니다."));

		// Category3 조회
		Category3 category3 = category3Repo.findByCategory3Name(itemsDTO.getCategory3Name())
				.orElseThrow(() -> new RuntimeException("Category3을 찾을 수 없습니다."));

		// 새로운 Item 생성 및 설정
		Items newItem = new Items();
		newItem.setCategory3(category3);
		newItem.setItemName(itemsDTO.getItemName());
		newItem.setPart1(itemsDTO.getPart1());
		newItem.setPart2(itemsDTO.getPart2()); // Nullable
		newItem.setPrice(itemsDTO.getPrice());
		newItem.setUnit(itemsDTO.getUnit());
		newItem.setMember(member);
		newItem.setEnabled(true);
		newItem.setForSale(true);

		// 물품 저장
		// itemsRepo.save(newItem);

		// 물품 저장
		Items savedItem = itemsRepo.save(newItem);

		// Leadtime 저장
		Leadtime leadtime = new Leadtime();
		leadtime.setItems(savedItem);
		leadtime.setLeadtime(itemsDTO.getLeadtime());

		leadtimeRepo.save(leadtime);
	}

	/////////////////////////////////////////////////////////////////////////////////// 상품
	/////////////////////////////////////////////////////////////////////////////////// 수정
	@Transactional
	public void updateMultipleItems(List<ItemsDTO> itemsDTOList, String username) {
		// 여러 아이템을 순차적으로 업데이트
		for (ItemsDTO itemsDTO : itemsDTOList) {
			updateItem(itemsDTO.getItemId(), itemsDTO, username);
		}
	}

	@Transactional
	public ItemsDTO updateItem(Integer itemId, ItemsDTO updatedItemDto, String username) {
		// 수정할 아이템 찾기
		Items item = itemsRepo.findById(itemId).orElseThrow(() -> new RuntimeException("해당 물품을 찾지 못했습니다."));

		// 현재 사용자(공급자)가 이 물품의 소유자인지 확인
		if (!item.getMember().getUsername().equals(username)) {
			throw new RuntimeException("해당 물품을 수정할 권한이 없습니다.");
		}

		// Category1, Category2, Category3을 모두 사용하여 Category3 엔티티 찾기
		Category3 category3 = category3Repo
				.findByCategoryNames(updatedItemDto.getCategory1Name(), updatedItemDto.getCategory2Name(),
						updatedItemDto.getCategory3Name())
				.orElseThrow(() -> new RuntimeException("Category3을 찾을 수 없습니다."));

		// 아이템 정보 업데이트
		item.setCategory3(category3); // Category3 설정
		item.setItemName(updatedItemDto.getItemName());
		item.setPart1(updatedItemDto.getPart1());
		item.setPart2(updatedItemDto.getPart2());
		item.setPrice(updatedItemDto.getPrice());
		item.setUnit(updatedItemDto.getUnit());
		item.setForSale(updatedItemDto.isForSale());

		itemsRepo.save(item);

		return convertToDto(item);
	}

	private ItemsDTO convertToDto(Items item) {
		// 엔티티를 DTO로 변환하는 로직
		return ItemsDTO.builder().itemId(item.getItemsId()).itemName(item.getItemName()).part1(item.getPart1())
				.part2(item.getPart2()).price(item.getPrice()).unit(item.getUnit()).forSale(item.isForSale())
				.category1Name(item.getCategory3().getCategory2().getCategory1().getCategoryName())
				.category2Name(item.getCategory3().getCategory2().getCategory2Name())
				.category3Name(item.getCategory3().getCategory3Name()).build();
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
			dto.setPrice((BigDecimal) result[4]); // price
			dto.setUnit((String) result[2]); // unit
			dto.setSupplierName((String) result[3]); // supplierName
			dto.setLeadtime((Integer) result[5]); // leadtime
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
