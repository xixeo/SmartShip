package com.lead.repository;

import com.lead.entity.Category2;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Category2Repo extends JpaRepository<Category2, Integer> {
    // 메서드
}
