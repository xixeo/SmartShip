package com.lead.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.dto.CartItemDTO;
import com.lead.entity.CartItem;
import com.lead.entity.Leadtime;
import com.lead.repository.CartItemRepo;
import com.lead.repository.LeadtimeRepo;


@Service
public class CartItemService {

    @Autowired
    private CartItemRepo cartItemRepo;
    
    @Autowired
    private LeadtimeRepo leadtimeRepo;


    // CartItem 엔티티를 CartItemDTO로 변환하는 메서드
    private List<CartItemDTO> convertCartItemToDTO(List<CartItem> cartItems) {
        return cartItems.stream().map(cartItem -> {
            var item = cartItem.getItem();
            
            // 콘솔에 enabled와 forSale 값을 출력하여 확인
            System.out.println("enabled: " + item.isEnabled() + ", forSale: " + item.isForSale());
            
            // Leadtime 정보 조회
            Leadtime leadtime = leadtimeRepo.findByItems_ItemsId(item.getItemsId())
                    .orElseThrow(() -> new RuntimeException("리드타임 정보가 없습니다."));
            
            // enabled 상태 체크 (비활성화된 경우 처리)
            boolean isSell = !item.isEnabled() || !item.isForSale();// enabled가 false이고 판매자가 판매중인 상품이 아니면 비활성화됨

            return new CartItemDTO(
                    cartItem.getCartItemId(),
                    item.getCategory3().getCategory2().getCategory1().getCategoryName(),
                    item.getCategory3().getCategory2().getCategory2Name(),
                    item.getCategory3().getCategory3Name(),
                    item.getItemsId(),
                    item.getItemName(),
                    item.getPart1(),
                    cartItem.getQuantity(),
                    item.getPrice(),
                    item.getUnit(),
                    item.getMember().getUsername(),
                    null, // cartItem.getRecommendedOrderDate()는 쿼리로 생성할 예정
                    leadtime.getLeadtime(),
                    isSell
                );
        }).collect(Collectors.toList());
    }
    
    // cartId로 장바구니 항목 조회
    public List<CartItemDTO> getCartItemsByCartId(Integer cartId) {
        List<CartItem> cartItems = cartItemRepo.findByCartCartId(cartId);
        return convertCartItemToDTO(cartItems);
    }

}
