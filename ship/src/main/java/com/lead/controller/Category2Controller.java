package com.lead.controller;

import com.lead.entity.Category2;
import com.lead.service.Category2Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories2")
public class Category2Controller {

    @Autowired
    private Category2Service category2Service;

    @GetMapping
    public ResponseEntity<List<Category2>> getAllCategories2() {
        List<Category2> categories = category2Service.getAllCategories2();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category2> getCategory2ById(@PathVariable int id) {
        Optional<Category2> category = category2Service.getCategory2ById(id);
        return category.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                       .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Category2> createCategory2(@RequestBody Category2 category2) {
        Category2 savedCategory = category2Service.saveCategory2(category2);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category2> updateCategory2(@PathVariable int id, @RequestBody Category2 category2) {
        Optional<Category2> existingCategory = category2Service.getCategory2ById(id);
        if (existingCategory.isPresent()) {
            category2.setCategory2_id(id);
            Category2 updatedCategory = category2Service.saveCategory2(category2);
            return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory2(@PathVariable int id) {
        category2Service.deleteCategory2(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
