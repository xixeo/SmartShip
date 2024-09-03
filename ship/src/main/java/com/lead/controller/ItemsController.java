package com.lead.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.ItemsDTO;
import com.lead.service.ItemsService;

@RestController
public class ItemsController {
//	  sql문 쓰는 방법
//    @Autowired
//    private ItemsRepo itemsRepo;
//
//    @GetMapping("/finditem")
//    public List<ItemsDTO> getAllItemsDetails() {
//        return itemsRepo.findAllItemsDetails();
//    }
	
	  @Autowired
	    private ItemsService itemsService;

	    @GetMapping("/finditem")
	    public List<ItemsDTO> getAllItemsDetails(@RequestParam(name = "name", required = false) String name) {
	        if (name == null) {
	            return itemsService.findItemsByName(""); // 전체 조회
	        } else {
	            return itemsService.findItemsByName(name); // 이름 기준 검색
	        }
	    }
}