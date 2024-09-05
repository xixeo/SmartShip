package com.lead.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lead.dto.ItemsDTO;
import com.lead.entity.Items;
import com.lead.repository.ItemsRepo;

@Service
public class ItemsService {

    @Autowired
    private ItemsRepo itemsRepo;

    @Transactional(readOnly = true)
    public List<ItemsDTO> findItems(String category1Name, String category2Name, String category3Name, String itemName, String supplierName) {

        Specification<Items> spec = (root, query, builder) -> {
            // 동적 조건 조합
            return builder.and(
                category1Name != null && !category1Name.isEmpty() ? 
                    builder.equal(root.join("category3").join("category2").join("category1").get("categoryName"), category1Name) : builder.conjunction(),
                
                category2Name != null && !category2Name.isEmpty() ? 
                    builder.equal(root.join("category3").join("category2").get("category2Name"), category2Name) : builder.conjunction(),
                
                category3Name != null && !category3Name.isEmpty() ? 
                    builder.equal(root.join("category3").get("category3Name"), category3Name) : builder.conjunction(),
                
                itemName != null && !itemName.isEmpty() ? 
                    builder.like(root.get("itemName"), "%" + itemName + "%") : builder.conjunction(),
                
                supplierName != null && !supplierName.isEmpty() ? 
                    builder.equal(root.join("supplier").get("supplierName"), supplierName) : builder.conjunction()
            );
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
                .supplierName(item.getSupplier().getSupplierName())
                .build();
    }
}
