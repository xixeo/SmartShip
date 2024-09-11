package com.lead.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.CartItemDTO;
import com.lead.dto.CartRequestDTO;
import com.lead.service.CartService;

@RestController
public class CartController {

	@Autowired
	private CartService cartService;

	// 장바구니에 물품 저장
	@PostMapping("/goCart")
	public ResponseEntity<String> addToCart(@RequestBody CartRequestDTO cartRequestDTO) {
		try {
			cartService.addToCart(cartRequestDTO);
			System.out.println("===========================장바구니로 보낸다");
			return ResponseEntity.ok("성공적으로 저장 되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("저장 되지 않았습니다.");
		}
	}

	// 장바구니 내역 조회
	@GetMapping("/getCart/{username}/{releaseDate}")
	public ResponseEntity<String> getCartByUserAndDate(@PathVariable String username,
			@PathVariable String releaseDate) {
		try {
			cartService.getCartByUserAndDate(username, LocalDate.parse(releaseDate));
			System.out.println("===========================장바구니 조회 한다");
			return ResponseEntity.ok("장바구니 내역이 성공적으로 조회되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("장바구니 내역을 조회하지 못했습니다.");
		}
	}

	// 장바구니 아이템 삭제
//	  @DeleteMapping("/delCartItems")
//	  public ResponseEntity<String> deleteCartItems(@RequestBody List<Integer> cartItemIds) {
//	      try {
//	          cartService.deleteCartItems(cartItemIds);
//	          return ResponseEntity.ok("선택된 물품들이 성공적으로 삭제되었습니다.");
//	      } catch (Exception e) {
//	          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제되지 않았습니다.");
//	      }
//	  } //cartItemId 기준 삭제

	@DeleteMapping("/delItem/{username}")
	public ResponseEntity<String> deleteItemsByItemId(@RequestBody List<Integer> itemIds,
			@PathVariable String username) {
		try {
			cartService.deleteItemsByItemId(itemIds, username);
			System.out.println("===========================물품 장바구니에서 삭제 한다");
			return ResponseEntity.ok("성공적으로 삭제되었습니다.");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류가 발생했습니다: " + e.getMessage());
		}
	}

	// 장바구니 아이템을 Orders로 저장
	@PostMapping("/saveToOrder/{username}/{releaseDate}")
	public ResponseEntity<String> saveCartItemsToOrder(@PathVariable String username, @PathVariable String releaseDate,
			@RequestBody List<CartItemDTO> cartItems) {
		try {
			LocalDate parsedReleaseDate = LocalDate.parse(releaseDate);
			// savedOrder 변수를 사용하지 않을 경우 제거
			cartService.saveCartItemsToOrder(cartItems, username, parsedReleaseDate);

			System.out.println("===========================물건 주문 한다");
			return ResponseEntity.ok("주문이 성공적으로 저장되었습니다.");
		} catch (Exception e) {
			System.err.println("주문을 저장하는 중 오류 :" + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("주문을 저장하는 중 오류가 발생했습니다.");
		}
	}

}
