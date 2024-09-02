package com.lead.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lead.entity.Category1;
import com.lead.service.Category1Service;

@RestController
@RequestMapping("/category1") // 기본 URL 경로 설정
public class Category1Controller {

    @Autowired
    private Category1Service category1Service;

    @GetMapping
    public List<Category1> getAllCategory1() {
        return category1Service.getAllCategory1();
    }
}