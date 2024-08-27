package com.lead.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lead.domain.Products;
import com.lead.service.ProductsService;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductsController {

    @Autowired
    private ProductsService productService;

    @GetMapping
    public List<Products> getAllProducts() {
        return productService.findAllProducts();
    }

    // methods
}