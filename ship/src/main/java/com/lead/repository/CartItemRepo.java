package com.lead.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lead.entity.Cart;
import com.lead.entity.CartItem;
import com.lead.entity.Items;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Integer> {

    // cartId로 CartItem 목록 조회
    List<CartItem> findByCartCartId(Integer cartId);
    
    List<CartItem> findByItem_ItemsIdAndCart_Member_Id(Integer itemsId, String userId);
    
    Optional<CartItem> findByCartAndItem(Cart cart, Items item);


}
