package com.lead.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.dto.OrderDetailDTO;
import com.lead.entity.Items;
import com.lead.entity.OrderDetail;
import com.lead.repository.OrderDetailRepo;

@Service
public class OrderDetailService {

	@Autowired
    private OrderDetailRepo orderDetailRepository;

    public List<OrderDetailDTO> getOrderDetailsByOrderId(Integer orderId) {
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderOrderId(orderId);

        return orderDetails.stream().map(orderDetail -> {
            Items item = orderDetail.getItem();
            return new OrderDetailDTO(
                item.getSupplier().getSupplierName(),
                item.getCategory2().getCategory1().getCategoryName(), 
                item.getCategory2().getCategory2Name(),
                orderDetail.getQuantity(),
                item.getPrice(),
                item.getUnit()
            );
        }).collect(Collectors.toList());
    }
}