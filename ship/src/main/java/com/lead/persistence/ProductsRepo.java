package com.lead.persistence;
import org.springframework.data.jpa.repository.JpaRepository;

import com.lead.domain.Products;


public interface ProductsRepo extends JpaRepository<Products, Long> {
    // query 
}