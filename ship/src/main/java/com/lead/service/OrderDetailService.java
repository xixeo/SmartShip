package com.lead.service;

import com.lead.entity.OrderDetail;
import com.lead.repository.OrderDetailRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderDetailService {

    @Autowired
    private OrderDetailRepo orderDetailRepo;

    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepo.findAll();
    }

    public Optional<OrderDetail> getOrderDetailById(int id) {
        return orderDetailRepo.findById(id);
    }

    public OrderDetail saveOrderDetail(OrderDetail orderDetail) {
        return orderDetailRepo.save(orderDetail);
    }

    public void deleteOrderDetail(int id) {
        orderDetailRepo.deleteById(id);
    }
}
