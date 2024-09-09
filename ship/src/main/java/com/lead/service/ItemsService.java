package com.lead.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lead.dto.ItemRecommendDTO;
import com.lead.dto.ItemsDTO;
import com.lead.entity.Items;
import com.lead.repository.ItemsRepo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class ItemsService {

	@Autowired
	private ItemsRepo itemsRepo;

	@PersistenceContext
	private EntityManager entityManager;

	@Transactional(readOnly = true)
	public List<ItemsDTO> findItems(String category1Name, String category2Name, String category3Name, String itemName) {

		// 영속성 컨텍스트 강제 초기화 (flush() 및 clear() 호출)
		entityManager.flush();
		entityManager.clear();

		Specification<Items> spec = (root, query, builder) -> {
			// 동적 조건 조합
			return builder.and(
					category1Name != null && !category1Name.isEmpty() ? builder.equal(
							root.join("category3").join("category2").join("category1").get("categoryName"),
							category1Name) : builder.conjunction(),

					category2Name != null && !category2Name.isEmpty() ? builder
							.equal(root.join("category3").join("category2").get("category2Name"), category2Name )
							: builder.conjunction(),

					category3Name != null && !category3Name.isEmpty()
							? builder.equal(root.join("category3").get("category3Name"),  category3Name)
							: builder.conjunction(),

					itemName != null && !itemName.isEmpty() ? builder.like(root.get("itemName"), "%" + itemName + "%")
							: builder.conjunction());
		};

		// JpaSpecificationExecutor의 findAll을 사용하여 필터링된 결과 조회
		List<Items> items = itemsRepo.findAll(spec);
		return items.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	private ItemsDTO convertToDto(Items item) {
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
				.alias(item.getMember().getAlias())
				.build();
	}
	
	public List<ItemRecommendDTO> getRecommendedItems(Integer selectedItemId, LocalDate releaseDate) {
        List<Object[]> results = itemsRepo.findAlternativeItems(selectedItemId, releaseDate.toString());

        return results.stream().map(result -> {
            ItemRecommendDTO dto = new ItemRecommendDTO();
            dto.setItemsId((Integer) result[0]); // itemsId
            dto.setItemName((String) result[1]); // itemName
            dto.setPrice((BigDecimal) result[2]); // price
            dto.setLeadtime((Integer) result[3]); // leadtime
            // recommendedOrderDate는 여기서 계산하거나 추가적인 로직이 필요함
            // 예를 들어, LocalDate recommendedDate = releaseDate.minusDays(leadtime);
            // dto.setRecommendedOrderDate(recommendedDate);
            return dto;
        }).collect(Collectors.toList());
    }
}
