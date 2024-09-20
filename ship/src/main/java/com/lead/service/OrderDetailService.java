package com.lead.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.lead.dto.OrderDetailDTO;
import com.lead.dto.OrderDetailUpdateDTO;
import com.lead.entity.Items;
import com.lead.entity.Leadtime;
import com.lead.entity.OrderDetail;
import com.lead.repository.ItemsRepo;
import com.lead.repository.LeadtimeRepo;
import com.lead.repository.OrderDetailRepo;

@Service
public class OrderDetailService {

	@Autowired
    private OrderDetailRepo orderDetailRepo;
	
	@Autowired
	private ItemsRepo itemsRepo;

	@Autowired
	private LeadtimeRepo leadtimeRepo;

	// OrderDetail을 OrderId로 가져오기
    public List<OrderDetailDTO> getOrderDetailsByOrderId(Integer orderId) {
        List<OrderDetail> orderDetails = orderDetailRepo.findByOrderOrderId(orderId);
        return convertOrderDetailToDTO(orderDetails);
    }
    
    // OrderDetail을 DTO로 변환
    private List<OrderDetailDTO> convertOrderDetailToDTO(List<OrderDetail> orderDetails) {  	   	
        return orderDetails.stream().map(orderDetail -> {
        	  //Orders order = orderDetail.getOrder();
              Items item = orderDetail.getItem();
            
            return new OrderDetailDTO(
            	orderDetail.getOrderDetailId(),
            	orderDetail.getItem().getCategory3().getCategory2().getCategory1().getCategoryName(),
            	orderDetail.getItem().getCategory3().getCategory2().getCategory2Name(),
            	orderDetail.getItem().getCategory3().getCategory3Name(),     
            	orderDetail.getItem().getItemsId(),
                item.getItemName(),
                item.getPart1(),
                orderDetail.getQuantity(),
                item.getPrice(),
                item.getUnit(),
                item.getMember().getUsername(),
                null,
                orderDetail.isOrdering(),
                orderDetail.getOrderDate()
            );
        }).collect(Collectors.toList());
    }
       

    // OrderDetail UPDATE
    public void updateOrderDetails(List<OrderDetailUpdateDTO> updateRequests, Authentication authentication) {
    	
		// 현재 사용자가 MANAGER인지 확인
		if (authentication.getAuthorities().stream().noneMatch(auth -> auth.getAuthority().equals("ROLE_MANAGER"))) {
			throw new RuntimeException("발주 내역 수정 권한이 없습니다.");
		}
			
    	for(OrderDetailUpdateDTO request : updateRequests) {
    		OrderDetail orderDetail = orderDetailRepo.findById(request.getOrderDetailId())
    				.orElseThrow(() -> new RuntimeException("OrderDetail 정보를 찾을 수 없습니다."));
    		
    		//수량 업데이트
    		if(request.getQuantity() != null) {
    			orderDetail.setQuantity(request.getQuantity());
    		}
    		
    		//itemsId 업데이트
    		if(request.getItemsId() != null) {
    		 Items newItem = itemsRepo.findById(request.getItemsId())
    				 .orElseThrow(() -> new RuntimeException("Items 정보를 찾을 수 없습니다."));
    		 orderDetail.setItem(newItem);
    		}
    		
    		//ordering true
    		orderDetail.setOrdering(true);
    		
    		//orderDate
    		orderDetail.setOrderDate(LocalDate.now());
    		
    		//저장
    		orderDetailRepo.save(orderDetail);
    	}
    }
    
    // bestOrderDate 계산 
    public LocalDate calculateBestOrderDate(List<OrderDetail> orderDetails, LocalDate releaseDate) {
        return orderDetails.stream()
            .map(orderDetail -> {
                Leadtime leadtime = leadtimeRepo.findByItems_ItemsId(orderDetail.getItem().getItemsId())
                    .orElseThrow(() -> new RuntimeException("해당 아이템의 리드타임을 찾을 수 없습니다: " + orderDetail.getItem().getItemsId()));
                return releaseDate.minusDays(leadtime.getLeadtime());
            })
            .min(LocalDate::compareTo) // 가장 늦은 주문일자를 선택
            .orElse(releaseDate); // 기본값으로 releaseDate 사용
    }


    // OrderDetail 대체상품으로 update
    public OrderDetailDTO updateOrderDetail(Integer orderDetailId, Integer newItemId) {
      // orderDetailId로 주문 상세 항목을 조회
      OrderDetail orderDetail = orderDetailRepo.findById(orderDetailId)
          .orElseThrow(() -> new RuntimeException("OrderDetail 정보를 찾을 수 없습니다."));

      // 새로운 Item을 itemId로 조회
      Items newItem = itemsRepo.findById(newItemId)
          .orElseThrow(() -> new RuntimeException("Items 정보를 찾을 수 없습니다."));

      // 새로운 값으로 업데이트
      orderDetail.setItem(newItem); // 새로운 Items를 OrderDetail에 설정

      // 변경 사항 저장
      orderDetailRepo.save(orderDetail);

      // DTO로 변환하여 반환
      return new OrderDetailDTO(
          orderDetail.getOrderDetailId(),
          newItem.getCategory3().getCategory2().getCategory1().getCategoryName(),
          newItem.getCategory3().getCategory2().getCategory2Name(),
          newItem.getCategory3().getCategory3Name(),
          newItem.getItemsId(),
          newItem.getItemName(),
          newItem.getPart1(),
          orderDetail.getQuantity(),
          newItem.getPrice(),
          newItem.getUnit(),
          newItem.getMember().getUsername(),
          null,
          orderDetail.isOrdering(),
          orderDetail.getOrderDate()
      );
  }


    
}