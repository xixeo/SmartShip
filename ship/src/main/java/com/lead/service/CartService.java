package com.lead.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.dto.CartDTO;
import com.lead.dto.CartItemDTO;
import com.lead.entity.Cart;
import com.lead.entity.CartItem;
import com.lead.entity.Items;
import com.lead.entity.Member;
import com.lead.repository.CartItemRepo;
import com.lead.repository.CartRepo;
import com.lead.repository.ItemsRepo;
import com.lead.repository.MemberRepo;

@Service
public class CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private MemberRepo memberRepo;
    
    @Autowired
    private ItemsRepo itemsRepo;

    @Autowired
    private CartItemRepo cartItemRepo;    

    @Autowired
    private CartItemService cartItemService; 

 // 장바구니 추가
    public CartDTO createOrder(CartDTO cartRequest) {
        // Alias에 해당하는 Member 찾기
        Member member = memberRepo.findByAlias(cartRequest.getAlias())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

        // Cart 엔티티 생성
        Cart cart = new Cart();
        cart.setMember(member);

        // Cart 저장
        Cart savedCart = cartRepo.save(cart);

        // 각 CartItemDTO를 처리하여 CartItem 저장
        for (CartItemDTO itemDetail : cartRequest.getCartItems()) {
            Items item = itemsRepo.findById(itemDetail.getItemsId())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 품목입니다."));

            // CartItem 생성
            CartItem cartItem = new CartItem();
            cartItem.setCart(savedCart); // Cart와 연관 설정
            cartItem.setItem(item); // Item과 연관 설정

            // 수량 설정
            if (itemDetail.getQuantity() == null) {
                throw new RuntimeException("수량 정보가 누락되었습니다.");
            }
            cartItem.setQuantity(itemDetail.getQuantity());

            // CartItem 저장
            cartItemRepo.save(cartItem);
        }

        // CartItems 리스트를 다시 조회하여 반환할 DTO 생성
        List<CartItemDTO> cartItems = cartItemService.getCartItemsByCartId(savedCart.getCartId());

        // 최종 결과 반환 (DTO 변환)
        return new CartDTO(
                savedCart.getCartId(),
                savedCart.getMember().getUsername(),
                savedCart.getMember().getAlias(),
                null,  // releaseDate는 추후 설정
                null,  // bestOrderDate는 추후 설정
                savedCart.getCreatedAt(),
                cartItems  // CartItems를 반환
        );
    }
    
}
