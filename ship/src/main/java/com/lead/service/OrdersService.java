package com.lead.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.dto.OrdersDTO;
import com.lead.entity.Orders;
import com.lead.repository.OrdersRepo;

@Service
public class OrdersService {

    @Autowired
    private OrdersRepo ordersRepository;

    public List<OrdersDTO> getAllOrders() {
        List<Orders> orders = ordersRepository.findAll();
        return convertOrdersToDTO(orders);
    }

    private List<OrdersDTO> convertOrdersToDTO(List<Orders> orders) {
        return orders.stream().map(order -> {
            return new OrdersDTO(
                order.getOrderId(),
                order.getListName(),
                order.getReleaseDate(),
                order.getBestOrderDate(),
                order.getMember().getAlias()
            );
        }).collect(Collectors.toList());
    }
}
