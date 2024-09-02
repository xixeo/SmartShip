package com.lead.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.entity.Category2;
import com.lead.repository.Category2Repo;

@Service
public class Category2Service {

	  @Autowired
	    private Category2Repo category2Repo;

	    public List<Category2> findItemsByCategory1IdAndName(Integer category1Id, String category2Name) {
	        return category2Repo.findByCategory1IdAndCategory2Name(category1Id, category2Name);
	    }

}