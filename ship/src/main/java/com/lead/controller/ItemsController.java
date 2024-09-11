package com.lead.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
	
	@GetMapping("/finditem")
	public ResponseEntity<List<ItemsDTO>> findItems(
	        @RequestParam(required = false) String category1Name,
	        @RequestParam(required = false) String category2Name,
	        @RequestParam(required = false) String category3Name,
	        @RequestParam(required = false) String itemName) {


	    List<ItemsDTO> items = itemsService.findItemsByRole(category1Name, category2Name, category3Name, itemName);

	    return ResponseEntity.ok(items);
	}


	@GetMapping("/recommend")
	public ResponseEntity<String> getRecommendations(@RequestParam("selectedItemId") Integer selectedItemId,
			@RequestParam("releaseDate") String releaseDate) {

		try {
			// 문자열을 LocalDate로 변환
			LocalDate releaseDateLocal = LocalDate.parse(releaseDate);

			System.out.println("===========================물품 추천 한다");
			List<ItemRecommendDTO> recommendations = itemRecommendService.getRecommendedItems(selectedItemId,
					releaseDateLocal);

			return ResponseEntity.ok(recommendations.toString()); // 리스트를 문자열로 변환하여 응답
		} catch (Exception e) {
			System.err.println("\"추천 물품을 조회하는 중 오류: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("추천 물품을 조회하는 중 오류가 발생했습니다.");
		}
	}

}
