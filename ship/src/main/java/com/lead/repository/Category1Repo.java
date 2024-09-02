package com.lead.repository;

import com.lead.entity.Category1;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Category1Repo extends JpaRepository<Category1, Integer> {
    // 메서드
}
