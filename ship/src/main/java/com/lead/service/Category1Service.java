package com.lead.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.entity.Category1;
import com.lead.repository.Category1Repo;

@Service
public class Category1Service {

    @Autowired
    private Category1Repo category1Repo;

    public List<Category1> getAllCategory1() {
        return category1Repo.findAll();
    }

}
