package com.lead.service;

import com.lead.entity.Suppliers;
import com.lead.repository.SuppliersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SuppliersService {

    @Autowired
    private SuppliersRepo suppliersRepo;

    public List<Suppliers> getAllSuppliers() {
        return suppliersRepo.findAll();
    }

    public Optional<Suppliers> getSupplierById(int id) {
        return suppliersRepo.findById(id);
    }

    public Suppliers saveSupplier(Suppliers supplier) {
        return suppliersRepo.save(supplier);
    }

    public void deleteSupplier(int id) {
        suppliersRepo.deleteById(id);
    }
}
