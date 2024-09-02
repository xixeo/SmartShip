package com.lead.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.lead.entity.Category2;
import com.lead.service.Category2Service;

@RestController
@RequestMapping("/category2")
public class Category2Controller {

    @Autowired
    private Category2Service category2Service;

    @GetMapping("/finditem")
    public List<Category2> findItems(
            @RequestParam("category1Id") Integer category1Id,
            @RequestParam("category2Name") String category2Name) {
        return category2Service.findItemsByCategory1IdAndName(category1Id, category2Name);
    }
}
