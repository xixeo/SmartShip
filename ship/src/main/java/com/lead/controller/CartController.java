package com.lead.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lead.dto.CartDTO;
import com.lead.service.CartService;

@RestController
public class CartController {

    @Autowired
    private CartService cartService;

    // 장바구니 생성 엔드포인트
    @PostMapping("/cart")
    public ResponseEntity<CartDTO> createCart(@RequestBody CartDTO cartRequest) {
        // Cart 생성
        CartDTO savedCart = cartService.createOrder(cartRequest);
        // 생성된 CartDTO를 반환
        return new ResponseEntity<>(savedCart, HttpStatus.CREATED);
    }
}
