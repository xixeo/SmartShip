package com.lead.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lead.dto.CartDTO;
import com.lead.dto.CartItemDTO;
import com.lead.dto.CartItemRequestDTO;
import com.lead.dto.CartRequestDTO;
import com.lead.dto.OrdersDTO;
import com.lead.entity.Cart;
import com.lead.entity.CartItem;
import com.lead.entity.Items;
import com.lead.entity.Leadtime;
import com.lead.entity.Member;
import com.lead.entity.OrderDetail;
import com.lead.entity.Orders;
import com.lead.repository.CartItemRepo;
import com.lead.repository.CartRepo;
import com.lead.repository.ItemsRepo;
import com.lead.repository.LeadtimeRepo;
import com.lead.repository.MemberRepo;
import com.lead.repository.OrderDetailRepo;
import com.lead.repository.OrdersRepo;

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

	@Autowired
	private OrdersRepo ordersRepo;

	@Autowired
	private OrderDetailRepo orderDetailRepo;

	@Autowired
	private LeadtimeRepo leadtimeRepo;

	/////////////////////////////////////////////////////////////////////////////////// 장바구니
	/////////////////////////////////////////////////////////////////////////////////// 조회
	public CartDTO getCartByUserAndDate(String username, LocalDate releaseDate) {
		Cart cart = cartRepo.findByMemberUsername(username)
			    .orElseThrow(() -> new RuntimeException("해당 장바구니를 찾을 수 없습니다."));

		  // CartItem 조회 및 Leadtime을 기반으로 bestOrderDate 계산
        List<CartItem> cartItems = cartItemRepo.findByCartCartId(cart.getCartId());
        List<CartItemDTO> cartItemDTOs = cartItems.stream().map(cartItem -> {
            Items item = cartItem.getItem();
            Leadtime leadtime = leadtimeRepo.findByItems_ItemsId(item.getItemsId())
                    .orElseThrow(() -> new RuntimeException("리드타임 정보가 없습니다."));

            LocalDate bestOrderDate = releaseDate.minusDays(leadtime.getLeadtime());
            return new CartItemDTO(cartItem.getCartItemId(), 
                                   item.getCategory3().getCategory2().getCategory1().getCategoryName(), 
                                   item.getCategory3().getCategory2().getCategory2Name(),
                                   item.getCategory3().getCategory3Name(), 
                                   item.getItemsId(), 
                                   item.getItemName(), 
                                   cartItem.getQuantity(),
                                   item.getPrice(), 
                                   item.getUnit(), 
                                   item.getMember().getUsername(), 
                                   bestOrderDate);
        }).collect(Collectors.toList());

        // bestOrderDate 계산
        LocalDate calculatedBestOrderDate = calculateBestOrderDate(cartItemDTOs, releaseDate);

     // 최종 결과 반환
        return new CartDTO(cart.getCartId(), 
                           cart.getMember().getUsername(), 
                           cart.getMember().getAlias(), 
                           releaseDate,  // releaseDate는 프론트에서 받은 값을 그대로 사용
                           calculatedBestOrderDate,  // 계산된 bestOrderDate 반환
                           cart.getCreatedAt(), 
                           cartItemDTOs);
	}

	// bestOrderDate 계산 로직 (하나로 통합)
	private LocalDate calculateBestOrderDate(List<CartItemDTO> cartItems, LocalDate releaseDate) {
		return cartItems.stream().map(item -> {
			Leadtime leadtime = leadtimeRepo.findByItems_ItemsId(item.getItemsId())
					.orElseThrow(() -> new RuntimeException("리드타임 정보가 없습니다."));
			return releaseDate.minusDays(leadtime.getLeadtime());
		}).min(LocalDate::compareTo) // 가장 늦은 bestOrderDate 반환
				.orElse(releaseDate);
	}

	/////////////////////////////////////////////////////////////////////////////////// 장바구니
	/////////////////////////////////////////////////////////////////////////////////// 추가
  public CartDTO addToCart(CartRequestDTO cartRequestDTO) {
        // Alias에 해당하는 Member 찾기
        Member member = memberRepo.findByUsername(cartRequestDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

        // Cart 엔티티 생성
        Cart cart = new Cart();
        cart.setMember(member);

        // Cart 저장
        Cart savedCart = cartRepo.save(cart);

        // 각 CartItemRequestDTO를 처리하여 CartItem 저장
        for (CartItemRequestDTO itemDetail : cartRequestDTO.getCartItems()) {
            Items item = itemsRepo.findById(itemDetail.getItemsId())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 품목입니다."));

            // CartItem 생성
            CartItem cartItem = new CartItem();
            cartItem.setCart(savedCart); // Cart와 연관 설정
            cartItem.setItem(item);      // Item과 연관 설정
            cartItem.setQuantity(itemDetail.getQuantity());

            // CartItem 저장
            cartItemRepo.save(cartItem);
        }

        // 최종 결과 반환 (DTO 변환)
        return new CartDTO(
        		savedCart.getCartId(), 
        		savedCart.getMember().getUsername(),
        		savedCart.getMember().getAlias(),
                null, 
                null, 
                savedCart.getCreatedAt(), 
                null
                );
    }

	/////////////////////////////////////////////////////////////////////////////////// 장바구니
	/////////////////////////////////////////////////////////////////////////////////// 삭제
  @Transactional
//  public void deleteCartItems(List<Integer> cartItemIds) {
//      for (Integer cartItemId : cartItemIds) {
//          // cartItemId가 존재하는지 먼저 확인
//          boolean exists = cartItemRepo.existsById(cartItemId);
//          
//          if (exists) {
//              try {
//                  cartItemRepo.deleteById(cartItemId); // cartItemRepo는 JPA Repository
//                  System.out.println("CartItem ID: " + cartItemId + " 삭제 성공");
//              } catch (Exception e) {
//                  System.err.println("CartItem ID: " + cartItemId + " 삭제 실패. 에러: " + e.getMessage());
//                  throw new RuntimeException("CartItem 삭제 중 에러 발생: " + cartItemId, e);
//              }
//          } else {
//              System.err.println("존재하지 않는 CartItemId: " + cartItemId);
//              throw new RuntimeException("존재하지 않는 CartItemId: " + cartItemId);
//          }
//      }
//  } // cartItemId 기준 삭제
  
  public void deleteItemsByItemId(List<Integer> itemIds, String username) {
	    for (Integer itemId : itemIds) {
	        // itemId와 username을 기반으로 cartItem을 찾음
	        List<CartItem> cartItems = cartItemRepo.findByItem_ItemsIdAndCart_Member_Username(itemId, username);

	        if (!cartItems.isEmpty()) {
	            for (CartItem cartItem : cartItems) {
	                cartItemRepo.delete(cartItem);
	            }
	        } else {
	            throw new RuntimeException("해당 itemId: " + itemId + "에 해당하는 장바구니 항목을 찾을 수 없습니다.");
	        }
	    }
	} //itemId 기준 삭제


	/////////////////////////////////////////////////////////////////////////////////// Orders로
	/////////////////////////////////////////////////////////////////////////////////// 저장
  @Transactional
  public OrdersDTO saveCartItemsToOrder(List<CartItemDTO> cartItems, String username, LocalDate releaseDate) {
      // 사용자 정보 확인
      Member member = memberRepo.findByUsername(username)
              .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

      // 주문 정보 생성
      Orders order = new Orders();
      order.setMember(member);
      order.setReleaseDate(releaseDate);
      order.setBestOrderDate(calculateBestOrderDate(cartItems, releaseDate)); // 계산된 bestOrderDate
      order.setOrderDate(LocalDate.now());

      Orders savedOrder = ordersRepo.save(order);

      // OrderDetail 저장 및 장바구니에서 삭제
      for (CartItemDTO itemDetail : cartItems) {
          List<CartItem> cartItemList = cartItemRepo.findByItem_ItemsIdAndCart_Member_Username(itemDetail.getItemsId(), username);

          if (cartItemList.isEmpty()) {
              throw new RuntimeException("해당 사용자에게 해당 품목이 장바구니에 없습니다: " + itemDetail.getItemsId());
          }

          // OrderDetail 저장 및 장바구니 삭제
          for (CartItem cartItem : cartItemList) {
              // OrderDetail 저장
              OrderDetail orderDetail = new OrderDetail();
              orderDetail.setOrder(savedOrder);
              orderDetail.setItem(cartItem.getItem());
              orderDetail.setQuantity(itemDetail.getQuantity()); 
              orderDetailRepo.save(orderDetail);

              // 장바구니에서 삭제
              cartItemRepo.delete(cartItem);
          }
      }

      return new OrdersDTO(
    		  savedOrder.getOrderId(), 
    		  savedOrder.getMember().getUsername(),
              savedOrder.getMember().getAlias(), 
              savedOrder.getReleaseDate(), 
              savedOrder.getBestOrderDate(),
              savedOrder.getOrderDate(), null);
  }

}
