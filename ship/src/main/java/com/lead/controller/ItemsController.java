package com.lead.controller;

import com.lead.entity.Items;
import com.lead.service.ItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ItemsController {

    @Autowired
    private ItemsService itemsService;

    @GetMapping("/finditem")
    public List<Items> getItems(@RequestParam Integer category1Id,
                                @RequestParam(required = false) String category2Name,
                                @RequestParam(required = false) String itemName,
                                @RequestParam(required = false) Integer supplierId) {
        return itemsService.getItems(category1Id, category2Name, itemName, supplierId);
    }
}
