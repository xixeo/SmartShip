package com.lead.controller;

import com.lead.entity.OrderHeader;
import com.lead.service.OrderHeaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orderHeaders")
public class OrderHeaderController {

    @Autowired
    private OrderHeaderService orderHeaderService;

    @GetMapping
    public ResponseEntity<List<OrderHeader>> getAllOrderHeaders() {
        List<OrderHeader> orderHeaders = orderHeaderService.getAllOrderHeaders();
        return new ResponseEntity<>(orderHeaders, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderHeader> getOrderHeaderById(@PathVariable int id) {
        Optional<OrderHeader> orderHeader = orderHeaderService.getOrderHeaderById(id);
        return orderHeader.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                          .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<OrderHeader> createOrderHeader(@RequestBody OrderHeader orderHeader) {
        OrderHeader savedOrderHeader = orderHeaderService.saveOrderHeader(orderHeader);
        return new ResponseEntity<>(savedOrderHeader, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderHeader> updateOrderHeader(@PathVariable int id, @RequestBody OrderHeader orderHeader) {
        Optional<OrderHeader> existingOrderHeader = orderHeaderService.getOrderHeaderById(id);
        if (existingOrderHeader.isPresent()) {
            orderHeader.setOrderId(id);
            OrderHeader updatedOrderHeader = orderHeaderService.saveOrderHeader(orderHeader);
            return new ResponseEntity<>(updatedOrderHeader, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderHeader(@PathVariable int id) {
        orderHeaderService.deleteOrderHeader(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
