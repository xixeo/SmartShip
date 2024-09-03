package com.lead.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.ItemsDTO;
import com.lead.repository.ItemsRepo;

@RestController
public class ItemsController {

    @Autowired
    private ItemsRepo itemsRepo;

    @GetMapping("/finditem")
    public List<ItemsDTO> getAllItemsDetails() {
        return itemsRepo.findAllItemsDetails();
    }
}