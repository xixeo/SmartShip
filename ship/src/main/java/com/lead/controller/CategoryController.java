package com.lead.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.Category1DTO;
import com.lead.dto.Category2DTO;
import com.lead.dto.Category3DTO;
import com.lead.service.CategoryService;

@RestController
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Category1 정보를 반환하는 엔드포인트
    @GetMapping("/category1")
    public ResponseEntity<List<Category1DTO>> getAllCategory1() {
        try {
            List<Category1DTO> category1DTOList = categoryService.getCategory1();
            return ResponseEntity.ok(category1DTOList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Category2 정보를 반환하는 엔드포인트
    @GetMapping("/category2")
    public ResponseEntity<List<Category2DTO>> getAllCategory2() {
        try {
            List<Category2DTO> category2DTOList = categoryService.getCategory2();
            return ResponseEntity.ok(category2DTOList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Category3 정보를 반환하는 엔드포인트
    @GetMapping("/category3")
    public ResponseEntity<List<Category3DTO>> getAllCategory3() {
        try {
            List<Category3DTO> category3DTOList = categoryService.getCategory3();
            return ResponseEntity.ok(category3DTOList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
