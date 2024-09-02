package com.lead.service;

import com.lead.entity.Category2;
import com.lead.repository.Category2Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Category2Service {

    @Autowired
    private Category2Repo category2Repo;

    public List<Category2> getAllCategories2() {
        return category2Repo.findAll();
    }

    public Optional<Category2> getCategory2ById(int id) {
        return category2Repo.findById(id);
    }

    public Category2 saveCategory2(Category2 category2) {
        return category2Repo.save(category2);
    }

    public void deleteCategory2(int id) {
        category2Repo.deleteById(id);
    }
}
