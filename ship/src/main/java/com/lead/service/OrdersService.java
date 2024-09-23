package com.lead.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.lead.dto.ManagerOrderDTO;
import com.lead.dto.ManagerOrderDetailDTO;
import com.lead.dto.OrderDetailDTO;
import com.lead.dto.OrdersDTO;
import com.lead.dto.UserOrderDTO;
import com.lead.dto.UserOrderDetailDTO;
import com.lead.entity.Items;
import com.lead.entity.Leadtime;
import com.lead.entity.OrderDetail;
import com.lead.entity.Orders;
import com.lead.repository.LeadtimeRepo;
import com.lead.repository.OrderDetailRepo;
import com.lead.repository.OrdersRepo;

@Service
public class OrdersService {

	@Autowired
	private OrdersRepo ordersRepo;

	@Autowired
	private OrderDetailRepo orderDetailRepo;

	@Autowired
	private LeadtimeRepo leadtimeRepo;

	// Orders만 반환
	public List<OrdersDTO> getOrders() {
		List<Orders> orders = ordersRepo.findAll();
		return orders.stream()
				.map(order -> new OrdersDTO(order.getOrderId(), order.getMember().getUsername(),
						order.getMember().getAlias(), order.getReleaseDate(), order.getBestOrderDate(),
						order.getRequestDate(), order.getMemo(), null // OrderDetail은 포함되지 않음
				)).collect(Collectors.toList());
	}

	// Orders & OrderDetail 반환
	public List<OrdersDTO> getOrdersWithDetails() {
		List<Orders> orders = ordersRepo.findAll();
		return orders.stream().map(order -> {
			List<OrderDetail> orderDetails = orderDetailRepo.findByOrderOrderId(order.getOrderId());
			List<OrderDetailDTO> orderDetailDTOs = convertOrderDetailToDTO(orderDetails, order.getReleaseDate());

			return new OrdersDTO(order.getOrderId(), order.getMember().getUsername(), order.getMember().getAlias(),
					order.getReleaseDate(), order.getBestOrderDate(), order.getRequestDate(), order.getMemo(),
					orderDetailDTOs);
		}).collect(Collectors.toList());
	}

	// 발주 요청 내역 조회(미발주 품목만) - ROLE_MANAGER
	public OrdersDTO getOrderDetailsByOrderId(Integer orderId, Authentication authentication) {

		// 현재 사용자가 해운선사인지 확인
		if (authentication.getAuthorities().stream().noneMatch(auth -> auth.getAuthority().equals("ROLE_MANAGER"))) {
			throw new RuntimeException("조회 권한이 없습니다.");
		}

		// Orders 정보 조회
		Orders order = ordersRepo.findById(orderId)
				.orElseThrow(() -> new RuntimeException("주문 정보를 찾을 수 없습니다: " + orderId));

		// 해당 주문에 연결된 OrderDetail 정보 조회
		List<OrderDetail> orderDetails = orderDetailRepo.findByOrderOrderId(orderId);

		// ordering = false인 OrderDetail만 필터링
		List<OrderDetail> filteredOrderDetails = orderDetails.stream().filter(orderDetail -> !orderDetail.isOrdering())
				.collect(Collectors.toList());

		// bestOrderDate 계산
		LocalDate bestOrderDate = calculateBestOrderDate(filteredOrderDetails, order.getReleaseDate());

		// OrderDetail을 DTO로 변환
		List<OrderDetailDTO> orderDetailDTOs = convertOrderDetailToDTO(filteredOrderDetails, order.getReleaseDate());

		// OrdersDTO 반환
		return new OrdersDTO(
				order.getOrderId(), 
				order.getMember().getUsername(), 
				order.getMember().getAlias(),
				order.getReleaseDate(), 
				bestOrderDate, // 계산된 bestOrderDate
				order.getRequestDate(), 
				order.getMemo(), 
				orderDetailDTOs
				);
	}

	// 날짜별로 orderDetail 묶어서 발주 완료 내역 조회 - ROLE_MANAGER
	public ManagerOrderDTO getOrderDetailsGroupedByOrderId(Integer orderId, Authentication authentication) {

	    // 현재 사용자가 manager인지 확인
	    if (authentication.getAuthorities().stream().noneMatch(auth -> auth.getAuthority().equals("ROLE_MANAGER"))) {
	        throw new RuntimeException("발주 내역 조회 권한이 없습니다.");
	    }

	    // orderId를 기반으로 Orders 조회
	    Orders order = ordersRepo.findById(orderId)
	            .orElseThrow(() -> new RuntimeException("해당 주문을 찾을 수 없습니다: " + orderId));

	    // orderId를 기반으로 OrderDetail 조회
	    List<OrderDetail> orderDetails = orderDetailRepo.findByOrderOrderId(orderId);

	    // OrderDetail을 OrderDetailDTO로 변환하고, orderDate로 그룹화
	    Map<LocalDate, List<ManagerOrderDetailDTO>> groupedOrderDetails = orderDetails.stream()
	            .map(orderDetail -> {
	            
	                // OrderDetailDTO로 변환
	                return new ManagerOrderDetailDTO(
	                        orderDetail.getOrderDetailId(),
	                        orderDetail.getItem().getItemsId(),
	                        orderDetail.getItem().getItemName(),
	                        orderDetail.getItem().getPart1(),
	                        orderDetail.getItem().getPrice(),
	                        orderDetail.getItem().getUnit(),
	                        orderDetail.getQuantity(),
	                        orderDetail.getItem().getMember().getUsername(),
	                        orderDetail.getOrderDate()
	                );
	            })
	            .collect(Collectors.groupingBy(ManagerOrderDetailDTO::getOrderDate)); // orderDate로 그룹화

	    // UserOrderDTO 반환
	    return new ManagerOrderDTO(
	            order.getOrderId(),
	            order.getMember().getUsername(),
	            order.getMember().getAlias(),
	            order.getRequestDate(),
	            order.getReleaseDate(),
	            order.getMemo(),
	            groupedOrderDetails // 그룹화된 OrderDetails 반환
	    );
	}

	// 발주 신청 내역 조회 - ROLE_USER
	public List<UserOrderDTO> getUserOrders(Authentication authentication) {
	    // JWT 토큰에서 사용자 정보 추출
	    String username = authentication.getName(); // 토큰에서 username 추출

	    // 해당 사용자의 주문만 조회
	    List<Orders> orders = ordersRepo.findByMemberUsername(username); // username으로 필터링

	    return orders.stream().map(order -> {
	        // OrderDetail 조회
	        List<OrderDetail> orderDetails = orderDetailRepo.findByOrderOrderId(order.getOrderId());

	        // OrderDetail을 UserOrderDetailDTO로 변환
	        List<UserOrderDetailDTO> orderDetailDTOs = convertOrderDetailToUserOrderDetailDTO(orderDetails);

	        // 상태 계산
	        String state = calculateOrderState(orderDetails);

	        // UserOrderDTO 반환
	        return new UserOrderDTO(
	            order.getOrderId(),
	            order.getMember().getUsername(),
	            order.getMember().getAlias(),
	            order.getRequestDate(),
	            order.getReleaseDate(),
	            order.getMemo(),
	            state, // 상태 필드 추가
	            orderDetailDTOs // 변환된 주문 상세 정보
	        );
	    }).collect(Collectors.toList());
	}

	// OrderDetail을 UserOrderDetailDTO로 변환하는 메서드
	private List<UserOrderDetailDTO> convertOrderDetailToUserOrderDetailDTO(List<OrderDetail> orderDetails) {
	    return orderDetails.stream().map(orderDetail -> {
	        Items item = orderDetail.getItem();
	        return new UserOrderDetailDTO(
	            orderDetail.getOrderDetailId(),
	            item.getItemsId(),
	            item.getItemName(),
	            item.getPart1(),
	            item.getPrice(),
	            item.getUnit(),
	            orderDetail.getQuantity(),
	            item.getMember().getUsername(),
	            orderDetail.getOrder().getRequestDate()
	        );
	    }).collect(Collectors.toList());
	}

	// 상태 계산 로직
	private String calculateOrderState(List<OrderDetail> orderDetails) {
	    if (orderDetails.isEmpty()) {
	        return "ready"; // OrderDetail이 없으면 'ready'
	    }

	    boolean allTrue = orderDetails.stream().allMatch(OrderDetail::isOrdering); // 모두 true인지 확인
	    boolean anyTrue = orderDetails.stream().anyMatch(OrderDetail::isOrdering); // 하나라도 true인지 확인

	    if (allTrue) {
	        return "complete";
	    } else if (anyTrue) {
	        return "progressing";
	    } else {
	        return "ready";
	    }
	}

	// bestOrderDate 계산 로직
	private LocalDate calculateBestOrderDate(List<OrderDetail> orderDetails, LocalDate releaseDate) {
		return orderDetails.stream().map(orderDetail -> {
			var leadtime = leadtimeRepo.findByItems_ItemsId(orderDetail.getItem().getItemsId()).orElseThrow(
					() -> new RuntimeException("해당 아이템의 리드타임을 찾을 수 없습니다: " + orderDetail.getItem().getItemsId()));
			return releaseDate.minusDays(leadtime.getLeadtime());
		}).min(LocalDate::compareTo) // 가장 늦은 주문일자를 선택
				.orElse(releaseDate); // 기본값으로 releaseDate 사용
	}

	// OrderDetail을 DTO로 변환하는 로직 (ItemRecommendService를 사용하여 recommendedOrderDate설정)
	private List<OrderDetailDTO> convertOrderDetailToDTO(List<OrderDetail> orderDetails, LocalDate releaseDate) {
		return orderDetails.stream().map(orderDetail -> {
			var item = orderDetail.getItem();
			

			// Leadtime 객체에서 leadtime 값을 가져오기
			Leadtime leadtimeEntity = leadtimeRepo.findByItems_ItemsId(item.getItemsId())
					.orElseThrow(() -> new RuntimeException("해당 아이템의 리드타임을 찾을 수 없습니다: " + item.getItemsId()));

			// leadtime 값을 가져와 recommendedOrderDate 계산
			int leadtime = leadtimeEntity.getLeadtime(); // int 타입으로 leadtime 값을 가져옴

			// 기간 내에 가능한지 계산하여 recommendedOrderDate 생성
			LocalDate recommendedOrderDate = releaseDate.minusDays(leadtime);

			return new OrderDetailDTO(
					orderDetail.getOrderDetailId(),
					item.getCategory3().getCategory2().getCategory1().getCategoryName(),
					item.getCategory3().getCategory2().getCategory2Name(), 
					item.getCategory3().getCategory3Name(),
					item.getItemsId(), item.getItemName(), 
					item.getPart1(), orderDetail.getQuantity(), 
					item.getPrice(),
					item.getUnit(), 
					leadtime,
					item.getMember().getUsername(), 
					recommendedOrderDate, orderDetail.isOrdering(),
					orderDetail.getOrderDate());
		}).collect(Collectors.toList());
	}
}
