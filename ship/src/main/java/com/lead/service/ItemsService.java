package com.lead.service;

import com.lead.entity.Items;
import com.lead.repository.ItemsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemsService {

    @Autowired
    private ItemsRepo itemsRepo;

    public List<Items> getAllItems() {
        return itemsRepo.findAll();
    }

    public Optional<Items> getItemById(int id) {
        return itemsRepo.findById(id);
    }

    public Items saveItem(Items item) {
        return itemsRepo.save(item);
    }

    public void deleteItem(int id) {
        itemsRepo.deleteById(id);
    }
}
