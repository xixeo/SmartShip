package com.lead.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lead.entity.Category2;

@Repository
public interface Category2Repo extends JpaRepository<Category2, Integer> {
    List<Category2> findByCategory1IdAndCategory2Name(Integer category1Id, String category2Name);
}