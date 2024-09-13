package com.lead.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lead.entity.Category1;

public interface Category1Repo extends JpaRepository<Category1, Integer> {
    Optional<Category1> findByCategoryName(String categoryName);
}
