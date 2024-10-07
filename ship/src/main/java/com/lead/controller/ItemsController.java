package com.lead.controller;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.ItemRecommendDTO;
import com.lead.dto.ItemsDTO;
import com.lead.service.ItemRecommendService;
import com.lead.service.ItemsService;

@RestController
public class ItemsController {

	@Autowired
	private ItemsService itemsService;

	@Autowired
	private ItemRecommendService itemRecommendService;

//	@GetMapping("/finditems")
//	public ResponseEntity<String> getAllItemsDetails(@RequestParam(required = false) String category1Name,
//			@RequestParam(required = false) String category2Name, @RequestParam(required = false) String category3Name,
//			@RequestParam(required = false) String itemName) {
//		try {
//			// 서비스로부터 필터링된 데이터 조회
//			List<ItemsDTO> items = itemsService.findItems(category1Name, category2Name, category3Name, itemName);
//
//			System.out.println("===========================물품 조회 한다");
//			return ResponseEntity.ok().cacheControl(CacheControl.noCache()) // 캐시 방지
//					.body(items.toString()); // 리스트를 문자열로 변환하여 응답
//		} catch (Exception e) {
//			System.err.println("물품을 조회하는 중 오류: " + e.getMessage());
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("물품을 조회하는 중 오류가 발생했습니다.");
//		}
//	}

	/////////////////////////////////////////////////////////////////////////////// 조회
	@GetMapping("/finditem")
	public ResponseEntity<?> findItems(@RequestParam(required = false) String category1Name,
	                                   @RequestParam(required = false) String category2Name,
	                                   @RequestParam(required = false) String category3Name,
	                                   @RequestParam(required = false) String itemName) {
	    try {
	        // 역할에 따라 아이템 조회
	        List<ItemsDTO> items = itemsService.findItemsByRole(category1Name, category2Name, category3Name, itemName);
	        
	        System.out.println("===========================물품 조회 한다");
	        // 정상적으로 조회된 경우 목록 반환
	        return ResponseEntity.ok(items);
	        
	    } catch (RuntimeException e) {
	        // 예외가 발생한 경우, 오류 메시지를 사용자에게 반환
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("오류 발생: " + e.getMessage());
	    }
	}


	/////////////////////////////////////////////////////////////////////////////// 등록
	@PostMapping("/supplier/items/add")
	public ResponseEntity<String> addItem(@RequestBody ItemsDTO itemsDTO) {
	    // JWT 토큰에서 사용자 정보 추출
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    String userId = authentication.getName(); // 토큰에서 username 추출
	    
	    try {
	        // 아이템 등록 서비스 호출
	        itemsService.addItem(itemsDTO, userId, authentication);
	        return ResponseEntity.ok("상품이 성공적으로 등록되었습니다.");
	    } catch(Exception e) {
	        // 예외 발생 시 오류 로그 출력
	        e.printStackTrace(); // 서버 콘솔에 오류 출력
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("물품 등록에 실패했습니다. " + e.getMessage());
	    }
	}
	
	/////////////////////////////////////////////////////////////////////////////// 수정
	@PutMapping("/supplier/items")
	public ResponseEntity<String> updateItems(@RequestBody List<ItemsDTO> itemsDTOList) {
	    // JWT 토큰에서 사용자 정보 추출
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    String userId = authentication.getName(); // 토큰에서 userId 추출

	    try {
	    	 System.out.println("===========================물품정보 수정 한다");
	        // 여러 아이템 수정 로직 호출
	        itemsService.updateMultipleItems(itemsDTOList, userId);
	        return ResponseEntity.ok("물품들이 성공적으로 수정되었습니다.");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("오류 발생: " + e.getMessage());
	    }
	}
	
	/////////////////////////////////////////////////////////////////////////////// 삭제
	@DeleteMapping("/supplier/delete")
	public ResponseEntity<String> deleteItems(@RequestBody List<Integer> itemIds) {
        // JWT 토큰에서 사용자 정보 추출 (SecurityContextHolder)
		  Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		    String userId = authentication.getName(); // 토큰에서 userId 추출

        try {
            itemsService.deleteItems(itemIds, userId);
            
            System.out.println("===========================물품 삭제 한다");
            
            return ResponseEntity.ok("물품이 성공적으로 삭제되었습니다.");
        } catch (RuntimeException e) {
            // 예외 발생 시 오류 메시지 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("물품 삭제 중 오류 발생: " + e.getMessage());
        }
    }
	
	/////////////////////////////////////////////////////////////////////////////// 대체상품추천

	@GetMapping("/recommend")
	public ResponseEntity<List<ItemRecommendDTO>> getRecommendations(
	        @RequestParam("selectedItemId") Integer selectedItemId,
	        @RequestParam("releaseDate") LocalDate releaseDate,
	        @RequestParam("orderId") Integer orderId) {

	    try {
	        System.out.println("===========================물품 추천 한다");
	        
	        List<ItemRecommendDTO> recommendations = itemRecommendService.getRecommendedItems(selectedItemId, releaseDate, orderId);

	        // JSON 형식으로 List<ItemRecommendDTO>를 반환
	        return ResponseEntity.ok(recommendations);
	    } catch (Exception e) {
	        System.err.println("추천 물품을 조회하는 중 오류: " + e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Collections.emptyList()); // 오류 발생 시 빈 리스트를 반환
	    }
	}


}
