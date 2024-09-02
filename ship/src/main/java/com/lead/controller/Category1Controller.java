package com.lead.controller;

import com.lead.entity.Category1;
import com.lead.service.Category1Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories1")
public class Category1Controller {

    @Autowired
    private Category1Service category1Service;

    @GetMapping
    public ResponseEntity<List<Category1>> getAllCategories() {
        List<Category1> categories = category1Service.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category1> getCategoryById(@PathVariable int id) {
        Optional<Category1> category = category1Service.getCategoryById(id);
        return category.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                       .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Category1> createCategory(@RequestBody Category1 category1) {
        Category1 savedCategory = category1Service.saveCategory(category1);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category1> updateCategory(@PathVariable int id, @RequestBody Category1 category1) {
        Optional<Category1> existingCategory = category1Service.getCategoryById(id);
        if (existingCategory.isPresent()) {
            category1.setCategoryId(id);
            Category1 updatedCategory = category1Service.saveCategory(category1);
            return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable int id) {
        category1Service.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
