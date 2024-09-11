package com.lead.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.lead.entity.RecommendedItem;

@Repository
public interface RecommendedItemRepo extends JpaRepository<RecommendedItem, Integer> {

    List<RecommendedItem> findByItem_ItemsId(Integer itemsId); // itemsId로 추천 아이템 조회
}
