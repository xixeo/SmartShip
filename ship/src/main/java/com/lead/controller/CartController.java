package com.lead.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.CartDTO;
import com.lead.dto.CartItemDTO;
import com.lead.dto.CartItemRequestDTO;
import com.lead.dto.CartRequestDTO;
import com.lead.service.CartService;

@RestController
public class CartController {

	@Autowired
	private CartService cartService;

	// 장바구니에 물품 저장
	@PostMapping("/goCart")

	public ResponseEntity<String> addToCart(@RequestBody List<CartItemRequestDTO> cartItems) {
		  try {
		        // CartItems를 서비스 호출
		        cartService.addToCart(cartItems);
		        System.out.println("===========================장바구니로 보낸다");
		        return ResponseEntity.ok("성공적으로 저장 되었습니다.");
		    } catch (Exception e) {
		    	  e.printStackTrace(); // 에러 로그 출력
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("저장 되지 않았습니다." + e.getMessage());
		    }
	}

	// 장바구니 내역 조회
	@GetMapping("/getCart/{releaseDate}")
	public ResponseEntity<?> getCartByDate(@PathVariable String releaseDate) {
	    try {
	        // 장바구니 내역을 조회
	        CartDTO cartItem = cartService.getCartByDate(LocalDate.parse(releaseDate));
	        System.out.println("===========================장바구니 조회 한다");

	        // 성공 메시지와 장바구니 항목을 함께 반환
	        Map<String, Object> response = new HashMap<>();
	        response.put("message", "장바구니 내역이 성공적으로 조회되었습니다.");
	        response.put("cartItem", cartItem); // 단일 객체

	        return ResponseEntity.ok(response);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("장바구니 내역을 조회하지 못했습니다." + e.getMessage());
	    }
	}

	// 장바구니 아이템 삭제
	@DeleteMapping("/delItem")
	public ResponseEntity<String> deleteItemsByItemId(@RequestBody List<Integer> itemIds) {
		try {
			cartService.deleteItemsByItemId(itemIds);
			System.out.println("===========================물품 장바구니에서 삭제 한다");
			return ResponseEntity.ok("성공적으로 삭제되었습니다.");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류가 발생했습니다: " + e.getMessage());
		}
	}

	// 장바구니 아이템을 Orders로 저장
	@PostMapping("/saveToOrder/{releaseDate}")
    public ResponseEntity<String> saveCartItemsToOrder(
            @PathVariable String releaseDate,
            @PathVariable String selectedDay,
            @RequestBody CartRequestDTO cartRequestDTO // CartRequestDTO 사용
    ) {
        try {
            LocalDate parsedReleaseDate = LocalDate.parse(releaseDate);
                        
            // CartItemRequestDTO -> CartItemDTO 변환
            List<CartItemDTO> cartItems = cartRequestDTO.getCartItems().stream()
                .map(cartItemRequest -> CartItemDTO.builder()
                    .itemsId(cartItemRequest.getItemsId())
                    .quantity(cartItemRequest.getQuantity())
                    .build()
                ).collect(Collectors.toList());

            // CartItemDTO와 memo를 서비스로 전달
            cartService.saveCartItemsToOrder(cartItems, parsedReleaseDate, cartRequestDTO.getMemo(), cartRequestDTO.getSelectedDay());

            System.out.println("===========================물건 주문 한다");
            return ResponseEntity.ok("주문이 성공적으로 저장되었습니다.");
        } catch (Exception e) {
            System.err.println("주문을 저장하는 중 오류 :" + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("주문을 저장하는 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
