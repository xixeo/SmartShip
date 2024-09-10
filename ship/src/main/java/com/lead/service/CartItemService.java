package com.lead.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.dto.CartItemDTO;
import com.lead.entity.CartItem;
import com.lead.repository.CartItemRepo;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepo cartItemRepo;

    // cartId로 장바구니 항목 조회
    public List<CartItemDTO> getCartItemsByCartId(Integer cartId) {
        List<CartItem> cartItems = cartItemRepo.findByCartCartId(cartId);
        return convertCartItemToDTO(cartItems);
    }

    // CartItem 엔티티를 CartItemDTO로 변환하는 메서드
    private List<CartItemDTO> convertCartItemToDTO(List<CartItem> cartItems) {
        return cartItems.stream().map(cartItem -> {
            var item = cartItem.getItem();
            return new CartItemDTO(
                cartItem.getCartItemId(),
                item.getCategory3().getCategory2().getCategory1().getCategoryName(),
                item.getCategory3().getCategory2().getCategory2Name(),
                item.getCategory3().getCategory3Name(),     
                item.getItemsId(),
                item.getItemName(),
                cartItem.getQuantity(),
                item.getPrice(),
                item.getUnit(),
                item.getMember().getUsername(),
                null //cartItem.getRecommendedOrderDate()는 쿼리로 생성할거야
            );
        }).collect(Collectors.toList());
    }
}
