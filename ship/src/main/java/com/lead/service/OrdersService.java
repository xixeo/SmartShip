package com.lead.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
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
import com.lead.entity.Season;
import com.lead.entity.SelectedDay;
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
						order.getMember().getAlias(), order.getMember().getPhone(), order.getReleaseDate(),
						order.getBestOrderDate(), order.getRequestDate(), order.getMemo(), order.getSelectedDay(), null // OrderDetail은
																														// 포함되지
																														// 않음
				)).collect(Collectors.toList());
	}

	// Orders & OrderDetail 반환
	public List<OrdersDTO> getOrdersWithDetails() {
		List<Orders> orders = ordersRepo.findAll();
		return orders.stream().map(order -> {
			List<OrderDetail> orderDetails = orderDetailRepo.findByOrderOrderId(order.getOrderId());

			// OrderDetail을 DTO로 변환할 때 releaseDate과 selectedDay를 전달
			List<OrderDetailDTO> orderDetailDTOs = convertOrderDetailToDTO(orderDetails, order.getReleaseDate(),
					order.getSelectedDay());

			return new OrdersDTO(order.getOrderId(), order.getMember().getUsername(), order.getMember().getAlias(),
					order.getMember().getPhone(), order.getReleaseDate(), order.getBestOrderDate(),
					order.getRequestDate(), order.getMemo(), order.getSelectedDay(), orderDetailDTOs);
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
		System.out.println("OrderDetail 결과 수: " + orderDetails.size());

		// ordering = false이고 cancel = false인 OrderDetail만 필터링
		List<OrderDetail> filteredOrderDetails = orderDetails.stream()
				.filter(orderDetail -> !orderDetail.isOrdering() && !orderDetail.isCancel())
				.collect(Collectors.toList());
		System.out.println("필터링 후 OrderDetail 수: " + filteredOrderDetails.size());

		// bestOrderDate 계산
		LocalDate bestOrderDate = calculateBestOrderDate(filteredOrderDetails, order.getReleaseDate(),
				order.getSelectedDay());

		// OrderDetail을 DTO로 변환
		List<OrderDetailDTO> orderDetailDTOs = filteredOrderDetails.stream().map(orderDetail -> {
			var item = orderDetail.getItem();

			System.out.println("리드타임 조회: itemsId = " + item.getItemsId() + ", selectedDay = " + order.getSelectedDay()
					+ ", releaseDate = " + order.getReleaseDate());

			List<Leadtime> leadtimes = null;
			try {
				// 리드타임 조회
				leadtimes = leadtimeRepo.findLeadtimeByItemsIdAndSelectedDayAndSeason(item.getItemsId(),
						order.getSelectedDay(), order.getReleaseDate());
				System.out.println("Leadtime 결과 수: " + (leadtimes != null ? leadtimes.size() : "null"));
			} catch (Exception e) {
				e.printStackTrace(); // 예외가 발생했는지 확인하기 위해 스택 트레이스 출력
			}

			// leadtime 값 설정
			Integer leadtime = (leadtimes != null && !leadtimes.isEmpty()) ? leadtimes.get(0).getLeadtime() : null;

			// recommendedOrderDate 계산
			LocalDate recommendedOrderDate = leadtime != null ? order.getReleaseDate().minusDays(leadtime) : null;

			return new OrderDetailDTO(orderDetail.getOrderDetailId(),
					item.getCategory3().getCategory2().getCategory1().getCategoryName(),
					item.getCategory3().getCategory2().getCategory2Name(), item.getCategory3().getCategory3Name(),
					item.getItemsId(), item.getItemName(), item.getPart1(), orderDetail.getQuantity(), item.getPrice(),
					item.getUnit(), leadtime, item.getMember().getUsername(), recommendedOrderDate,
					orderDetail.isOrdering(), orderDetail.isCancel(), orderDetail.getOrderDate());
		}).collect(Collectors.toList());

		// OrdersDTO 반환
		return new OrdersDTO(order.getOrderId(), order.getMember().getUsername(), order.getMember().getAlias(),
				order.getMember().getPhone(), order.getReleaseDate(), bestOrderDate, // 계산된 bestOrderDate
				order.getRequestDate(), order.getMemo(), order.getSelectedDay(), orderDetailDTOs // 리드타임이 포함된 DTO 리스트
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
				.filter(orderDetail -> orderDetail.getOrderDate() != null)
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
					orderDetail.getOrderDate());
		}).collect(Collectors.groupingBy(ManagerOrderDetailDTO::getOrderDate)); // orderDate로 그룹화

		// UserOrderDTO 반환
		return new ManagerOrderDTO(order.getOrderId(), order.getMember().getUsername(), order.getMember().getAlias(),
				order.getRequestDate(), order.getReleaseDate(), order.getMemo(), groupedOrderDetails // 그룹화된
																										// OrderDetails
																										// 반환
		);
	}

	// 발주 신청 내역 조회 - ROLE_USER
	public List<UserOrderDTO> getUserOrders(Authentication authentication) {
	    // JWT 토큰에서 사용자 ID 추출 (id로 변경)
	    String userId = authentication.getName(); // 토큰에서 id 추출

	    // 해당 사용자의 주문만 조회 (id로 필터링)
	    List<Orders> orders = ordersRepo.findByMemberId(userId); // id로 필터링

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
	                order.getMember().getId(), // userId를 반환
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
			return new UserOrderDetailDTO(orderDetail.getOrderDetailId(), item.getItemsId(), item.getItemName(),
					item.getPart1(), item.getPrice(), item.getUnit(), orderDetail.getQuantity(),
					item.getMember().getUsername(), orderDetail.getOrder().getRequestDate(), orderDetail.isCancel());
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
	private LocalDate calculateBestOrderDate(List<OrderDetail> orderDetails, LocalDate releaseDate,
			SelectedDay selectedDay) {
		// 주문 세부 사항이 비어 있으면 releaseDate를 반환
		if (orderDetails.isEmpty()) {
			return releaseDate;
		}

		return orderDetails.stream().map(orderDetail -> {
			var item = orderDetail.getItem();

			// 리드타임 조회
			List<Leadtime> leadtimes = leadtimeRepo.findLeadtimeByItemsIdAndSelectedDayAndSeason(item.getItemsId(),
					selectedDay, releaseDate);

			// 리드타임이 없는 경우 예외 처리
			if (leadtimes.isEmpty()) {
				throw new RuntimeException("리드타임 정보를 찾을 수 없습니다: " + item.getItemsId());
			}

			// 리드타임 값 가져오기
			int leadtimeValue = leadtimes.get(0).getLeadtime();

			// 주문 날짜 계산
			return releaseDate.minusDays(leadtimeValue);
		}).min(LocalDate::compareTo) // 가장 빠른 주문일자를 선택
				.orElse(releaseDate); // 기본값으로 releaseDate 사용
	}

	// OrderDetail을 DTO로 변환하는 로직 (리드타임을 조건에 맞춰 설정)
	// OrderDetail을 DTO로 변환하는 로직 (리드타임을 조건에 맞춰 설정)
	private List<OrderDetailDTO> convertOrderDetailToDTO(List<OrderDetail> orderDetails, LocalDate releaseDate,
			SelectedDay selectedDay) {
		return orderDetails.stream().map(orderDetail -> {
			var item = orderDetail.getItem();

			// season 결정
			Season season;
			int month = releaseDate.getMonthValue();
			if (month >= 3 && month <= 5) {
				season = Season.SPRING;
			} else if (month >= 6 && month <= 8) {
				season = Season.SUMMER;
			} else if (month >= 9 && month <= 11) {
				season = Season.FALL;
			} else {
				season = Season.WINTER;
			}

			// 리드타임 조회
			List<Leadtime> leadtimes = leadtimeRepo.findLeadtimeByItemsIdAndSelectedDayAndSeason(item.getItemsId(),
					selectedDay, releaseDate // releaseDate를 사용
			);

			// leadtime 값 설정
			Integer leadtime = leadtimes.isEmpty() ? null : leadtimes.get(0).getLeadtime(); // 기본값 설정

			// recommendedOrderDate 계산
			LocalDate recommendedOrderDate = leadtime != null ? releaseDate.minusDays(leadtime) : null;

			return new OrderDetailDTO(orderDetail.getOrderDetailId(),
					item.getCategory3().getCategory2().getCategory1().getCategoryName(),
					item.getCategory3().getCategory2().getCategory2Name(), item.getCategory3().getCategory3Name(),
					item.getItemsId(), item.getItemName(), item.getPart1(), orderDetail.getQuantity(), item.getPrice(),
					item.getUnit(), leadtime, item.getMember().getUsername(), recommendedOrderDate,
					orderDetail.isOrdering(), orderDetail.isCancel(), orderDetail.getOrderDate());
		}).collect(Collectors.toList());
	}

}