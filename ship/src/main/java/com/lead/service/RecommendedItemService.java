package com.lead.service;

import com.lead.entity.RecommendedItem;
import com.lead.repository.RecommendedItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecommendedItemService {

    @Autowired
    private RecommendedItemRepo recommendedItemRepo;

    public List<RecommendedItem> getAllRecommendedItems() {
        return recommendedItemRepo.findAll();
    }

    public Optional<RecommendedItem> getRecommendedItemById(int id) {
        return recommendedItemRepo.findById(id);
    }

    public RecommendedItem saveRecommendedItem(RecommendedItem recommendedItem) {
        return recommendedItemRepo.save(recommendedItem);
    }

    public void deleteRecommendedItem(int id) {
        recommendedItemRepo.deleteById(id);
    }
}
