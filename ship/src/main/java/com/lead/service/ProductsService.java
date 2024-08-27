package com.lead.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lead.domain.Products;
import com.lead.persistence.ProductsRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductsService {

	private final ProductsRepo productsRepo; 
	
    public List<Products> findAllProducts() {
        return productsRepo.findAll();
    }

    // service methods
}