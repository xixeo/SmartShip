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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.CartDTO;
import com.lead.dto.CartItemDTO;
import com.lead.dto.CartRequestDTO;
import com.lead.dto.OrdersDTO;
import com.lead.service.CartService;

@RestController
public class CartController {

	@Autowired
	private CartService cartService;

	// 장바구니에 물품 저장
	@PostMapping("/goCart")
    public ResponseEntity<String> addToCart(@RequestBody CartRequestDTO cartRequestDTO) {
		try {
			CartDTO savedCart = cartService.addToCart(cartRequestDTO);
			return ResponseEntity.ok("성공적으로 저장 되었습니다.");
		}catch (Exception e){
			 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("저장 되지 않았습니다.");			
		}
    }

	// 장바구니 내역 조회
	  @GetMapping("/getCart/{username}/{releaseDate}")
	    public ResponseEntity<String> getCartByUserAndDate(@PathVariable String username, @PathVariable String releaseDate) {
		  try {
		        CartDTO cart = cartService.getCartByUserAndDate(username, LocalDate.parse(releaseDate));
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
	    public ResponseEntity<String> deleteItemsByItemId(@RequestBody List<Integer> itemIds, @PathVariable String username) {
	        try {
	            cartService.deleteItemsByItemId(itemIds, username);
	            return ResponseEntity.ok("성공적으로 삭제되었습니다.");
	        } catch (RuntimeException e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류가 발생했습니다: " + e.getMessage());
	        }
	    }
	  

	// 장바구니 아이템을 Orders로 저장
	  @PostMapping("/saveToOrder/{username}/{releaseDate}")
	    public ResponseEntity<OrdersDTO> saveCartItemsToOrder(
	            @PathVariable String username, 
	            @PathVariable String releaseDate,
	            @RequestBody List<CartItemDTO> cartItems) {
	        
	        LocalDate parsedReleaseDate = LocalDate.parse(releaseDate);
	        OrdersDTO savedOrder = cartService.saveCartItemsToOrder(cartItems, username, parsedReleaseDate);

	        return ResponseEntity.ok(savedOrder);
	    }

}
