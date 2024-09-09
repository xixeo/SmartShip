package com.lead.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lead.dto.OrderDetailDTO;
import com.lead.dto.OrderItemRequestDTO;
import com.lead.dto.OrderRequestDTO;
import com.lead.dto.OrdersDTO;
import com.lead.entity.Items;
import com.lead.entity.Member;
import com.lead.entity.OrderDetail;
import com.lead.entity.Orders;
import com.lead.repository.ItemsRepo;
import com.lead.repository.MemberRepo;
import com.lead.repository.OrderDetailRepo;
import com.lead.repository.OrdersRepo;

@Service
public class OrdersService {

	@Autowired
	private OrdersRepo ordersRepository;

	@Autowired
	private OrderDetailRepo orderDetailRepo;

	@Autowired
	private ItemsRepo itemsRepo; // Item 정보를 위해 추가

	@Autowired
	private MemberRepo memberRepo; // Member 정보를 위해 추가

	// Orders만 반환
	public List<OrdersDTO> getOrders() {
		List<Orders> orders = ordersRepository.findAll();
		return orders.stream()
				.map(order -> new OrdersDTO(order.getOrderId(), order.getMember().getUsername(),
						order.getMember().getAlias(), order.getReleaseDate(), order.getBestOrderDate(),
						order.getOrderDate(), order.getMemo(), null // OrderDetail

				)).collect(Collectors.toList());
	}

	// Orders & OrderDetail까지 반환
	public List<OrdersDTO> getOrdersWithDetails() {
		List<Orders> orders = ordersRepository.findAll();
		return orders.stream().map(order -> {
			List<OrderDetail> orderDetails = orderDetailRepo.findByOrderOrderId(order.getOrderId());
			List<OrderDetailDTO> orderDetailDTOs = orderDetails.stream().map(orderDetail -> {
				return new OrderDetailDTO(orderDetail.getOrderDetailId(), orderDetail.getItem().getItemName(),
						orderDetail.getQuantity(), orderDetail.getItem().getPrice(), orderDetail.getItem().getUnit(),
						orderDetail.getItem().getMember().getUsername());
			}).collect(Collectors.toList());

			return new OrdersDTO(order.getOrderId(), order.getMember().getUsername(), order.getMember().getAlias(),
					order.getReleaseDate(), order.getBestOrderDate(), order.getOrderDate(), order.getMemo(),
					orderDetailDTOs);
		}).collect(Collectors.toList());
	}

///////////////////////////////////////////////////////////////////////////////////////////////////////  저장
	public OrdersDTO createOrder(OrderRequestDTO orderRequest) {
        // Alias에 해당하는 Member 찾기
        Member member = memberRepo.findByAlias(orderRequest.getAlias())
                                  .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

        // Orders 엔티티 생성
        Orders order = new Orders();
//        order.setReleaseDate(LocalDate.parse(orderRequest.getReleaseDate()));
//        order.setBestOrderDate(LocalDate.parse(orderRequest.getBestOrderDate()));
//        order.setOrderDate(LocalDate.now());  // 현재 날짜를 orderDate로 설정
        order.setMember(member);
        order.setMemo(orderRequest.getMemo());

        // Orders 저장
        Orders savedOrder = ordersRepository.save(order);

        // 각 ItemDTO를 처리하여 orderDetail 저장
        for (OrderItemRequestDTO itemDetail : orderRequest.getItemDetails()) {
            Items item = itemsRepo.findById(itemDetail.getItemId())
                                  .orElseThrow(() -> new RuntimeException("존재하지 않는 품목입니다."));

            // OrderDetail 생성
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(savedOrder);  // Order와 연관 설정
            orderDetail.setItem(item);         // Item과 연관 설정

            // 수량 설정
            if (itemDetail.getQuantity() == null) {
                throw new RuntimeException("수량 정보가 누락되었습니다.");
            }
            orderDetail.setQuantity(itemDetail.getQuantity());

            // orderDetail 저장
            orderDetailRepo.save(orderDetail);
        }

        // 최종 결과 반환 (DTO 변환)
        return new OrdersDTO(
            savedOrder.getOrderId(),
            savedOrder.getMember().getUsername(),
            savedOrder.getMember().getAlias(),
//            savedOrder.getReleaseDate(),
//            savedOrder.getBestOrderDate(),
//            savedOrder.getOrderDate(),
            null, // releaseDate update때 생성
            null, // bestOrderDate update때 생성
            null, // orderDate update때 생성
            savedOrder.getMemo(),
            null  // 필요시 orderDetails 추가 가능
        );
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////  수정
	 @Transactional
	public OrdersDTO updateOrder(Integer orderId, OrderRequestDTO orderRequest) {
		
		//OrderId로 기존 주문 조회
		Orders existingOrder = ordersRepository.findById(orderId).orElseThrow(() -> new RuntimeException("해당 주문을 찾을 수 없습니다."));
		
		//bestOrderDate와 releaseDate가 있는지 확인
		if(orderRequest.getReleaseDate() == null || orderRequest.getBestOrderDate() == null) {
			throw new RuntimeException("bestOrderDate와 releaseDate를 입력해주세요.");
		}
		
		//기존 orders 정보 업데이트
		existingOrder.setReleaseDate(LocalDate.parse(orderRequest.getReleaseDate()));
		existingOrder.setBestOrderDate(LocalDate.parse(orderRequest.getBestOrderDate()));
		existingOrder.setOrderDate(LocalDate.now());

		// 기존 주문 정보 저장
        Orders updatedOrder = ordersRepository.save(existingOrder);
        
     // 기존 OrderDetail 조회
        List<OrderDetail> existingOrderDetails = orderDetailRepo.findByOrderOrderId(orderId);
		
		//새로운 값 저장
		for(OrderItemRequestDTO itemDetail : orderRequest.getItemDetails()) {
			Items item = itemsRepo.findById(itemDetail.getItemId()).orElseThrow(() -> new RuntimeException("존재하지 않는 품목입니다."));
			
			   // 기존 OrderDetail 찾기
	        Optional<OrderDetail> existingDetail = existingOrderDetails.stream()
	                .filter(od -> od.getItem().getItemsId().equals(itemDetail.getItemId()))
	                .findFirst();
			
	        if (existingDetail.isPresent()) {
	            // 기존 아이템이 있으면 업데이트
	            OrderDetail orderDetail = existingDetail.get();
	            orderDetail.setQuantity(itemDetail.getQuantity());
	            orderDetailRepo.save(orderDetail);
	        } else {
	            // 새로 추가해야 할 아이템이면 생성
	            OrderDetail newOrderDetail = new OrderDetail();
	            newOrderDetail.setOrder(updatedOrder);
	            newOrderDetail.setItem(item);
	            newOrderDetail.setQuantity(itemDetail.getQuantity());
	            orderDetailRepo.save(newOrderDetail);
	        }
		}
		
		//DTO반환
		return new OrdersDTO(
				updatedOrder.getOrderId(),
				updatedOrder.getMember().getUsername(),
				updatedOrder.getMember().getAlias(),
				updatedOrder.getReleaseDate(),
				updatedOrder.getBestOrderDate(),
				updatedOrder.getOrderDate(),
				updatedOrder.getMemo(),
				null			
				);
	}
}
