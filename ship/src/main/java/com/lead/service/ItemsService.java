package com.lead.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.entity.Items;
import com.lead.repository.ItemsRepo;

@Service
public class ItemsService {

    @Autowired
    private ItemsRepo itemsRepo;

    public List<Items> getItems(Integer category1Id, String category2Name, String itemName, Integer supplierId) {
        return itemsRepo.findByCategoryAndItem(category1Id, category2Name, itemName, supplierId);
    }
}
