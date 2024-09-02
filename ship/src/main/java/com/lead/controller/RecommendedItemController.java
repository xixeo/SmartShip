package com.lead.controller;

import com.lead.entity.RecommendedItem;
import com.lead.service.RecommendedItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recommendedItems")
public class RecommendedItemController {

    @Autowired
    private RecommendedItemService recommendedItemService;

    @GetMapping
    public ResponseEntity<List<RecommendedItem>> getAllRecommendedItems() {
        List<RecommendedItem> recommendedItems = recommendedItemService.getAllRecommendedItems();
        return new ResponseEntity<>(recommendedItems, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecommendedItem> getRecommendedItemById(@PathVariable int id) {
        Optional<RecommendedItem> recommendedItem = recommendedItemService.getRecommendedItemById(id);
        return recommendedItem.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                              .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<RecommendedItem> createRecommendedItem(@RequestBody RecommendedItem recommendedItem) {
        RecommendedItem savedRecommendedItem = recommendedItemService.saveRecommendedItem(recommendedItem);
        return new ResponseEntity<>(savedRecommendedItem, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecommendedItem> updateRecommendedItem(@PathVariable int id, @RequestBody RecommendedItem recommendedItem) {
        Optional<RecommendedItem> existingRecommendedItem = recommendedItemService.getRecommendedItemById(id);
        if (existingRecommendedItem.isPresent()) {
            recommendedItem.setRecommendedId(id);
            RecommendedItem updatedRecommendedItem = recommendedItemService.saveRecommendedItem(recommendedItem);
            return new ResponseEntity<>(updatedRecommendedItem, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecommendedItem(@PathVariable int id) {
        recommendedItemService.deleteRecommendedItem(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
