package com.lead.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.ManagerOrderDTO;
import com.lead.dto.OrderDetailDTO;
import com.lead.dto.OrderDetailUpdateDTO;
import com.lead.dto.OrdersDTO;
import com.lead.dto.UserOrderDTO;
import com.lead.service.OrderDetailService;
import com.lead.service.OrdersService;

@RestController
public class OrdersController {

	@Autowired

	private OrdersService ordersService;

	@Autowired
	private OrderDetailService orderDetailService;

	// 추천 아이템으로 업데이트
	@PutMapping("/updateItem")
	public ResponseEntity<?> updateOrderDetailItem(@RequestParam Integer orderDetailId, // 주문 상세 항목 ID
			@RequestParam Integer newItemId // 새로운 아이템 ID
	) {
		try {
			System.out.println("===========================대체 상품 들어간다");
			OrderDetailDTO updatedOrderDetail = orderDetailService.updateOrderDetail(orderDetailId, newItemId);
			return ResponseEntity.ok(updatedOrderDetail);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("대체상품 입력 중 오류 발생: " + e.getMessage());
		}
	}

	// orderDetail 조회
	@GetMapping("/getOrderDetail/{orderId}")
	public ResponseEntity<?> getOrderById(@PathVariable Integer orderId) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		try {
			System.out.println("===========================발주 요청 내역 조회 한다");
			OrdersDTO orderDetails = ordersService.getOrderDetailsByOrderId(orderId, authentication);
			return ResponseEntity.ok(orderDetails);

		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("발주 요청 내역 조회 중 오류 발생: " + e.getMessage());
		}
	}

	// 발주 처리
	@PutMapping("/orderUpdate")
	public ResponseEntity<String> updateOrderDetails(@RequestBody List<OrderDetailUpdateDTO> updateRequest,
			Authentication authentication) {
		Authentication authentication1 = SecurityContextHolder.getContext().getAuthentication();

		try {
			System.out.println("===========================발주 처리 한다");
			orderDetailService.updateOrderDetails(updateRequest, authentication1);
			return ResponseEntity.ok("성공적으로 업데이트 되었습니다.");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("발주 처리 중 오류 발생: " + e.getMessage());
		}
	}

	// orderId로 OrderDetails 조회 및 orderDate로 그룹화
	@GetMapping("/details/{orderId}")
	public ResponseEntity<?> getOrderDetailsByOrderId(@PathVariable Integer orderId, Authentication authentication) {

		Authentication authentication2 = SecurityContextHolder.getContext().getAuthentication();

		try {
			System.out.println("===========================발주 확인 한다");
			ManagerOrderDTO orderDetails = ordersService.getOrderDetailsGroupedByOrderId(orderId, authentication2);
			return ResponseEntity.ok(orderDetails);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("오류 발생: " + e.getMessage());
		}
	}

	// ROLE_USER가 본인의 발주 요청 내역을 조회하는 엔드포인트
	@GetMapping("/userOrders")
	public ResponseEntity<?> getUserOrders(Authentication authentication) {
		try {

			System.out.println("===========================주문내역 확인 한다");
			List<UserOrderDTO> userOrders = ordersService.getUserOrders(authentication);

			return ResponseEntity.ok(userOrders);
		} catch (Exception e) {
			// 에러 발생 시 에러 메시지 반환
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("주문 내역을 조회하는 중 오류가 발생했습니다: " + e.getMessage());
		}
	}

	// 발주 불가능한 품목 삭제처리
	@PutMapping("/cancelOrderItem/{orderDetailId}")
	public ResponseEntity<?> cancelDetailItem(@PathVariable Integer orderDetailId) {
	    try {
	        System.out.println("===========================OrderDetail Item 취소 시도 - Item ID: " + orderDetailId);

	        // 서비스 로직 호출 (cancel 처리)
	        orderDetailService.cancelDetailItem(orderDetailId);

	        // 성공 메시지 반환
	        return ResponseEntity.ok("OrderDetail Item이 성공적으로 취소되었습니다.");
	    } catch (Exception e) {
	        // 에러 처리
	        System.out.println("OrderDetail Item 취소 중 오류 발생 - Item ID: " + orderDetailId + " Error: " + e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("OrderDetail Item 취소 중 오류가 발생했습니다: " + e.getMessage());
	    }
	}



//	@Autowired
//	private OrdersService ordersService;
//  
//	// 주문 생성
//	@PostMapping("/newOrder")
//	public ResponseEntity<OrdersDTO> createOrder(@RequestBody OrderRequestDTO orderRequest) {
//		OrdersDTO createdOrder = ordersService.createOrder(orderRequest);
//		System.out.println("===========================장바구니 넣었다");
//		return ResponseEntity.ok(createdOrder);
//	}
//	
//	// 주문 수정
//	@PutMapping("/newOrder/{orderId}")
//	public ResponseEntity<OrdersDTO> updateOrder(@PathVariable Integer orderId, @RequestBody OrderRequestDTO orderRequest) {
//		OrdersDTO updatedOrder = ordersService.updateOrder(orderId, orderRequest);
//		System.out.println("===========================주문 넣었다");
//		return ResponseEntity.ok(updatedOrder);
//	}
//	
//	 // 주문과 날짜로 조회
//    @GetMapping("/order/{orderId}/releaseDate/{releaseDate}")
//    public ResponseEntity<OrdersDTO> getOrderByIdAndReleaseDate(
//            @PathVariable Integer orderId,
//            @PathVariable LocalDate releaseDate) {
//        OrdersDTO order = ordersService.getOrderByIdAndReleaseDate(orderId, releaseDate);
//        return ResponseEntity.ok(order);
//    }
}
