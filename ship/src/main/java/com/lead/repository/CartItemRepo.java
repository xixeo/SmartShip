package com.lead.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.lead.entity.CartItem;
import java.util.List;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Integer> {

    // cartId로 CartItem 목록 조회
    List<CartItem> findByCartCartId(Integer cartId);
}
