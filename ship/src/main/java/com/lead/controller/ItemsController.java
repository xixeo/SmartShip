package com.lead.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
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

	@GetMapping("/finditem")
	public ResponseEntity<List<ItemsDTO>> getAllItemsDetails(@RequestParam(required = false) String category1Name,
			@RequestParam(required = false) String category2Name, @RequestParam(required = false) String category3Name,
			@RequestParam(required = false) String itemName) {

		// 서비스로부터 필터링된 데이터 조회
		List<ItemsDTO> items = itemsService.findItems(category1Name, category2Name, category3Name, itemName);

		System.out.println("===========================물품 조회 한다");
		return ResponseEntity.ok().cacheControl(CacheControl.noCache()) // 캐시 방지
				.body(items);
	}

	@GetMapping("/recommend")
    public List<ItemRecommendDTO> getRecommendations(
            @RequestParam("selectedItemId") Integer selectedItemId,
            @RequestParam("releaseDate") String releaseDate) {

        // 문자열을 LocalDate로 변환
        LocalDate releaseDateLocal = LocalDate.parse(releaseDate);

        System.out.println("===========================물품 추천 한다");
        return itemRecommendService.getRecommendedItems(selectedItemId, releaseDateLocal);
    }
}
