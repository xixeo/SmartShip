package com.lead.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lead.entity.Category2;

public interface Category2Repo extends JpaRepository<Category2, Integer> {
    Optional<Category2> findByCategory2Name(String category2Name);
}
