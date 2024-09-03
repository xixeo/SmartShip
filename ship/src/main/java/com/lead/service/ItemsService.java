package com.lead.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.dto.ItemsDTO;
import com.lead.entity.Items;
import com.lead.repository.ItemsRepo;

@Service
public class ItemsService {

	
	//sql을 쓰는 방식은 service가 필요없다..

    @Autowired
    private ItemsRepo itemsRepo;

    public List<ItemsDTO> findItemsByName(String name) {
        List<Items> items = itemsRepo.findByItemNameContaining(name);
        return items.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private ItemsDTO convertToDto(Items item) {
        return ItemsDTO.builder()
                .itemName(item.getItemName())
                .category1Name(item.getCategory2().getCategory1().getCategoryName())
                .category2Name(item.getCategory2().getCategory2Name())
                .part1(item.getPart1())
                .part2(item.getPart2())
                .price(item.getPrice())
                .unit(item.getUnit())
                .supplierName(item.getSupplier().getSupplierName())
                .build();
    }
}
