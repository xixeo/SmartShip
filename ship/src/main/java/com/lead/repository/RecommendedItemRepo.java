package com.lead.repository;

import com.lead.entity.RecommendedItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecommendedItemRepo extends JpaRepository<RecommendedItem, Integer> {
    // 필요한 추가 메서드를 정의할 수 있습니다.
}
