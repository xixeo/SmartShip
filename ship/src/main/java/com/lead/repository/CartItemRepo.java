package com.lead.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lead.entity.CartItem;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Integer> {

    // cartId로 CartItem 목록 조회
    List<CartItem> findByCartCartId(Integer cartId);
    
    List<CartItem> findByItem_ItemsIdAndCart_Member_Username(Integer itemsId, String username);

}
