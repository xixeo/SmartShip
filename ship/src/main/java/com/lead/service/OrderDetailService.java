package com.lead.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.dto.OrderDetailDTO;
import com.lead.entity.Items;
import com.lead.entity.OrderDetail;
import com.lead.repository.ItemsRepo;
import com.lead.repository.OrderDetailRepo;

@Service
public class OrderDetailService {

	@Autowired
    private OrderDetailRepo orderDetailRepository;
	
	@Autowired
	private ItemsRepo itemsRepository;


	// OrderDetail을 OrderId로 가져오기
    public List<OrderDetailDTO> getOrderDetailsByOrderId(Integer orderId) {
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderOrderId(orderId);
        return convertOrderDetailToDTO(orderDetails);
    }

    // OrderDetail update
    public OrderDetailDTO updateOrderDetail(Integer orderDetailId, Integer newQuantity, Integer newItemId) {
        // orderDetailId로 주문 상세 항목을 조회
        OrderDetail orderDetail = orderDetailRepository.findById(orderDetailId)
            .orElseThrow(() -> new RuntimeException("OrderDetail 정보를 찾을 수 없습니다."));

        // 새로운 Item을 itemId로 조회
        Items newItem = itemsRepository.findById(newItemId)
            .orElseThrow(() -> new RuntimeException("Items 정보를 찾을 수 없습니다."));

        // 새로운 값으로 업데이트
        orderDetail.setQuantity(newQuantity);
        orderDetail.setItem(newItem); // 새로운 Items를 OrderDetail에 설정
        orderDetail.setOrdering(true); // ordering 컬럼 true로 설정

        // 변경 사항 저장
        orderDetailRepository.save(orderDetail);

        // DTO로 변환하여 반환
        return new OrderDetailDTO(
            orderDetail.getOrderDetailId(),
            newItem.getCategory3().getCategory2().getCategory1().getCategoryName(),
            newItem.getCategory3().getCategory2().getCategory2Name(),
            newItem.getCategory3().getCategory3Name(),
            newItem.getItemsId(),
            newItem.getItemName(),
            orderDetail.getQuantity(),
            newItem.getPrice(),
            newItem.getUnit(),
            newItem.getMember().getUsername(),
            null,
            orderDetail.isOrdering()
        );
    }

    // OrderDetail을 DTO로 변환
    private List<OrderDetailDTO> convertOrderDetailToDTO(List<OrderDetail> orderDetails) {
        return orderDetails.stream().map(orderDetail -> {
            var item = orderDetail.getItem();
            return new OrderDetailDTO(
            	orderDetail.getOrderDetailId(),
            	orderDetail.getItem().getCategory3().getCategory2().getCategory1().getCategoryName(),
            	orderDetail.getItem().getCategory3().getCategory2().getCategory2Name(),
            	orderDetail.getItem().getCategory3().getCategory3Name(),     
            	orderDetail.getItem().getItemsId(),
                item.getItemName(),
                orderDetail.getQuantity(),
                item.getPrice(),
                item.getUnit(),
                item.getMember().getUsername(),
                null,
                orderDetail.isOrdering()
            );
        }).collect(Collectors.toList());
    }
}