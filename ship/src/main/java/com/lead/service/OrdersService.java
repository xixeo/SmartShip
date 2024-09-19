package com.lead.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.dto.OrderDetailDTO;
import com.lead.dto.OrdersDTO;
import com.lead.entity.OrderDetail;
import com.lead.entity.Orders;
import com.lead.repository.OrderDetailRepo;
import com.lead.repository.OrdersRepo;

@Service
public class OrdersService {

	@Autowired
	private OrdersRepo ordersRepository;

	@Autowired
	private OrderDetailRepo orderDetailRepo;


	// Orders만 반환
	public List<OrdersDTO> getOrders() {
		List<Orders> orders = ordersRepository.findAll();
		return orders.stream()
				.map(order -> new OrdersDTO(
						order.getOrderId(), 
						order.getMember().getUsername(),
						order.getMember().getAlias(), 
						order.getReleaseDate(), 
						order.getBestOrderDate(),
						order.getOrderDate(), order.getMemo(), null // OrderDetail

				)).collect(Collectors.toList());
	}

	// Orders & OrderDetail까지 반환
	public List<OrdersDTO> getOrdersWithDetails() {
		List<Orders> orders = ordersRepository.findAll();
		return orders.stream().map(order -> {
			List<OrderDetail> orderDetails = orderDetailRepo.findByOrderOrderId(order.getOrderId());
			List<OrderDetailDTO> orderDetailDTOs = orderDetails.stream().map(orderDetail -> {
				return new OrderDetailDTO(orderDetail.getOrderDetailId(),
						orderDetail.getItem().getCategory3().getCategory2().getCategory1().getCategoryName(),
						orderDetail.getItem().getCategory3().getCategory2().getCategory2Name(),
						orderDetail.getItem().getCategory3().getCategory3Name(), orderDetail.getItem().getItemsId(), orderDetail.getItem().getItemName(),
						orderDetail.getQuantity(), orderDetail.getItem().getPrice(), orderDetail.getItem().getUnit(),
						orderDetail.getItem().getMember().getUsername(), 
						null,
						orderDetail.isOrdering()
						);
			}).collect(Collectors.toList());

			return new OrdersDTO(order.getOrderId(), order.getMember().getUsername(), order.getMember().getAlias(),
					order.getReleaseDate(), order.getBestOrderDate(), order.getOrderDate(), order.getMemo(),
					orderDetailDTOs);
		}).collect(Collectors.toList());
	}
}
