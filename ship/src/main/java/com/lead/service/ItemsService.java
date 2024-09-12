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

	
	
	/////////////////////////////////////////////////////////////////////////////////// 전체 상품 조회
	/////////////////////////////////////////////////////////////////////////////////// ROLE.SUPPLIER 입장 / ROLE.USER 입장
	@Transactional(readOnly = true)
	public List<ItemsDTO> findItemsByRole(String category1Name, String category2Name,
	                                      String category3Name, String itemName) {
		
		  // JWT 토큰에서 사용자 정보 추출 (SecurityContextHolder)
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    String username = authentication.getName(); // 토큰에서 username 추출
	    String role = authentication.getAuthorities().stream()
	                    .findFirst()
	                    .orElseThrow(() -> new RuntimeException("권한 정보를 찾을 수 없습니다."))
	                    .getAuthority(); // role 추출
	    
	    // 영속성 컨텍스트 강제 초기화 (flush() 및 clear() 호출) -- 조회가 여러번 타서 넣음
	    entityManager.flush();
	    entityManager.clear();

	    Specification<Items> spec = (root, query, builder) -> {

	        // ROLE 따른 필터링
	        if (role.equals("ROLE_SUPPLIER")) {
	            // ROLE_SUPPLIER: username으로 필터링하여 자신의 물품만 조회
	            return builder.and(
	                builder.equal(root.join("member").get("username"), username),
	                createCommonFilters(root, builder, category1Name, category2Name, category3Name, itemName)
	            );
	        } else if (role.equals("ROLE_USER")) {
	            // ROLE_USER: 모든 물품 조회
	            return builder.and(
	                createCommonFilters(root, builder, category1Name, category2Name, category3Name, itemName)
	            );
	        } else {
	            // 다른 역할일 경우 예외 처리
	            throw new RuntimeException("조회 권한이 없습니다.");
	        }
	    };

	    // JpaSpecificationExecutor의 findAll을 사용하여 필터링된 결과 조회
	    List<Items> items = itemsRepo.findAll(spec);
	    return items.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	private Predicate createCommonFilters(Root<Items> root, CriteriaBuilder builder, String category1Name,
	                                      String category2Name, String category3Name, String itemName) {
	    return builder.and(
	        category1Name != null && !category1Name.isEmpty() ? builder.equal(
	            root.join("category3").join("category2").join("category1").get("categoryName"),
	            category1Name) : builder.conjunction(),

	        category2Name != null && !category2Name.isEmpty() ? builder.equal(
	            root.join("category3").join("category2").get("category2Name"), category2Name) : builder.conjunction(),

	        category3Name != null && !category3Name.isEmpty() ? builder.equal(
	            root.join("category3").get("category3Name"), category3Name) : builder.conjunction(),

	        itemName != null && !itemName.isEmpty() ? builder.like(
	            root.get("itemName"), "%" + itemName + "%") : builder.conjunction()
	    );
	}

	private ItemsDTO convertToDto(Items item) {		
	       
        // Leadtime 정보 조회
           Leadtime leadtime = leadtimeRepo.findByItems_ItemsId(item.getItemsId())
                   .orElseThrow(() -> new RuntimeException("리드타임 정보가 없습니다."));
           
	    return ItemsDTO.builder()
	        .itemId(item.getItemsId())
	        .itemName(item.getItemName())
	        .category1Name(item.getCategory3().getCategory2().getCategory1().getCategoryName())
	        .category2Name(item.getCategory3().getCategory2().getCategory2Name())
	        .category3Name(item.getCategory3().getCategory3Name())
	        .part1(item.getPart1())
	        .part2(item.getPart2())
	        .price(item.getPrice())
	        .unit(item.getUnit())
	        .supplierName(item.getMember().getUsername())
	        .alias(item.getMember().getAlias())
	        .leadtime(leadtime.getLeadtime())
	        .build();
	}
	
	/////////////////////////////////////////////////////////////////////////////////// 상품
	/////////////////////////////////////////////////////////////////////////////////// 등록

	
	
	/////////////////////////////////////////////////////////////////////////////////// 상품
	/////////////////////////////////////////////////////////////////////////////////// 수정
	  @Transactional
	    public void updateItem(Integer itemId, ItemsDTO itemsDTO, String username) {
	        // itemId로 물품 조회
	        Items item = itemsRepo.findById(itemId)
	                .orElseThrow(() -> new RuntimeException("해당 물품을 찾을 수 없습니다."));

	        // 현재 사용자(공급자)가 이 물품의 소유자인지 확인
	        if (!item.getMember().getUsername().equals(username)) {
	            throw new RuntimeException("해당 물품을 수정할 권한이 없습니다.");
	        }

	        // 필수 필드 체크
        	if (itemsDTO.getCategory3Name() == null) {
	            throw new RuntimeException("카테고리 정보가 필요합니다.");
	        }
	        if (itemsDTO.getItemName() == null || itemsDTO.getItemName().isEmpty()) {
	            throw new RuntimeException("상품 이름이 필요합니다.");
	        }
	        if (itemsDTO.getPrice() == null) {
	            throw new RuntimeException("가격 정보가 필요합니다.");
	        }
	        if (itemsDTO.getUnit() == null || itemsDTO.getUnit().isEmpty()) {
	            throw new RuntimeException("단위 정보가 필요합니다.");
	        }
	        // category3Name으로 카테고리 조회
	        Category3 category3 = category3Repo.findByCategory3Name(itemsDTO.getCategory3Name())
	                .orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));

	        // 물품 정보 수정
	        item.setItemName(itemsDTO.getItemName());
	        item.setPart1(itemsDTO.getPart1());  // null 허용
	        item.setPart2(itemsDTO.getPart2());  // null 허용
	        item.setPrice(itemsDTO.getPrice());
	        item.setUnit(itemsDTO.getUnit());
	        
	        // 카테고리 3 설정
	        item.setCategory3(category3);
	        
	        // username은 수정하지 않음, 현재 로그인한 사용자가 물품의 소유자임을 가정

	        // 수정된 정보 저장
	        itemsRepo.save(item);
	    }

	/////////////////////////////////////////////////////////////////////////////////// 대체 상품
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
