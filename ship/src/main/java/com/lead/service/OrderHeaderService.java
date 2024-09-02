package com.lead.service;

import com.lead.entity.OrderHeader;
import com.lead.repository.OrderHeaderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderHeaderService {

    @Autowired
    private OrderHeaderRepo orderHeaderRepo;

    public List<OrderHeader> getAllOrderHeaders() {
        return orderHeaderRepo.findAll();
    }

    public Optional<OrderHeader> getOrderHeaderById(int id) {
        return orderHeaderRepo.findById(id);
    }

    public OrderHeader saveOrderHeader(OrderHeader orderHeader) {
        return orderHeaderRepo.save(orderHeader);
    }

    public void deleteOrderHeader(int id) {
        orderHeaderRepo.deleteById(id);
    }
}
