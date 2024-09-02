package com.lead.service;

import com.lead.entity.Category1;
import com.lead.repository.Category1Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Category1Service {

    @Autowired
    private Category1Repo category1Repo;

    public List<Category1> getAllCategories() {
        return category1Repo.findAll();
    }

    public Optional<Category1> getCategoryById(int id) {
        return category1Repo.findById(id);
    }

    public Category1 saveCategory(Category1 category1) {
        return category1Repo.save(category1);
    }

    public void deleteCategory(int id) {
        category1Repo.deleteById(id);
    }
}
