package com.lead.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lead.dto.CartDTO;
import com.lead.dto.CartItemDTO;
import com.lead.dto.CartItemRequestDTO;
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
	private OrdersRepo ordersRepo;

	@Autowired
	private OrderDetailRepo orderDetailRepo;

	@Autowired
	private LeadtimeRepo leadtimeRepo;

	/////////////////////////////////////////////////////////////////////////////////// 장바구니
	/////////////////////////////////////////////////////////////////////////////////// 조회
	public CartDTO getCartByDate(LocalDate releaseDate) {

		// JWT 토큰에서 사용자 정보 추출 (SecurityContextHolder)
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName(); // 토큰에서 username 추출

		Cart cart = cartRepo.findByMemberUsername(username)
				.orElseThrow(() -> new RuntimeException("해당 장바구니를 찾을 수 없습니다."));

		List<CartItem> cartItems = cartItemRepo.findByCartCartId(cart.getCartId());
		List<CartItemDTO> cartItemDTOs = cartItems.stream().map(cartItem -> {

			Items item = cartItem.getItem();

			// Leadtime 정보 조회
			Leadtime leadtime = leadtimeRepo.findByItems_ItemsId(item.getItemsId())
					.orElseThrow(() -> new RuntimeException("리드타임 정보가 없습니다."));

			// LocalDate bestOrderDate = releaseDate.minusDays(leadtime.getLeadtime());

			// 판매 가능 여부: enabled가 true이고 forSale이 true여야 판매 가능
			boolean isSell = item.isEnabled() && item.isForSale(); // 판매 여부 판단

			return new CartItemDTO(cartItem.getCartItemId(),
					item.getCategory3().getCategory2().getCategory1().getCategoryName(),
					item.getCategory3().getCategory2().getCategory2Name(), item.getCategory3().getCategory3Name(),
					item.getItemsId(), item.getItemName(), item.getPart1(), cartItem.getQuantity(), item.getPrice(),
					item.getUnit(), item.getMember().getUsername(), null, leadtime.getLeadtime(), isSell);
		}).collect(Collectors.toList());

		// bestOrderDate 계산
		// LocalDate calculatedBestOrderDate = calculateBestOrderDate(cartItemDTOs,
		// releaseDate);

		// 최종 결과 반환
		return new CartDTO(cart.getCartId(), cart.getMember().getUsername(), cart.getMember().getAlias(), releaseDate, // releaseDate는
																														// 프론트에서
																														// 받은
																														// 값을
																														// 그대로
																														// 사용
				// calculatedBestOrderDate, // 계산된 bestOrderDate 반환
				null, cart.getCreatedAt(), cartItemDTOs);
	}

	// bestOrderDate 계산 로직
//	private LocalDate calculateBestOrderDate(List<CartItemDTO> cartItems, LocalDate releaseDate) {
//		return cartItems.stream().map(item -> {
//			Leadtime leadtime = leadtimeRepo.findByItems_ItemsId(item.getItemsId())
//					.orElseThrow(() -> new RuntimeException("리드타임 정보가 없습니다."));
//			return releaseDate.minusDays(leadtime.getLeadtime());
//		}).min(LocalDate::compareTo) // 가장 늦은 bestOrderDate 반환
//				.orElse(releaseDate);		
//	}

	/////////////////////////////////////////////////////////////////////////////////// 장바구니
	/////////////////////////////////////////////////////////////////////////////////// 추가
	@Transactional
	public CartDTO addToCart(List<CartItemRequestDTO> cartItems) {
		// JWT 토큰에서 사용자 정보 추출 (SecurityContextHolder)
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName(); // 토큰에서 username 추출

		// Alias에 해당하는 Member 찾기
		Member member = memberRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

		// 사용자의 기존 장바구니가 있는지 확인
		Cart cart = cartRepo.findByMemberUsername(username).orElse(null);

		if (cart == null) {
			// 장바구니가 없으면 새로 생성
			cart = new Cart();
			cart.setMember(member);
			cart = cartRepo.save(cart); // 새로운 장바구니 저장
		}

		// 각 CartItemRequestDTO를 처리하여 CartItem 저장
		for (CartItemRequestDTO itemDetail : cartItems) {
			Items item = itemsRepo.findById(itemDetail.getItemsId())
					.orElseThrow(() -> new RuntimeException("존재하지 않는 품목입니다."));

			// 이미 장바구니에 동일한 itemId가 있는지 확인
			Optional<CartItem> existingCartItem = cartItemRepo.findByCartAndItem(cart, item);

			if (existingCartItem.isPresent()) {
				// 이미 있는 cartItem이면 수량 증가
				CartItem cartItem = existingCartItem.get();
				cartItem.setQuantity(cartItem.getQuantity() + itemDetail.getQuantity());
				cartItemRepo.save(cartItem); // 업데이트
			} else {
				// CartItem 생성 및 저장
				CartItem cartItem = new CartItem();
				cartItem.setCart(cart);
				cartItem.setItem(item);
				cartItem.setQuantity(itemDetail.getQuantity());
				cartItemRepo.save(cartItem);
			}
		}

		// 최종 결과 반환 (DTO 변환)
		return new CartDTO(cart.getCartId(), cart.getMember().getUsername(), cart.getMember().getAlias(), null, null,
				cart.getCreatedAt(), null);
	}

	/////////////////////////////////////////////////////////////////////////////////// 장바구니
	/////////////////////////////////////////////////////////////////////////////////// 삭제
	@Transactional
	public void deleteItemsByItemId(List<Integer> itemIds) {
		// JWT 토큰에서 사용자 정보 추출 (SecurityContextHolder)
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName(); // 토큰에서 username 추출

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
	} // itemId 기준 삭제

	/////////////////////////////////////////////////////////////////////////////////// Orders로
	/////////////////////////////////////////////////////////////////////////////////// 저장

	@Transactional
	public OrdersDTO saveCartItemsToOrder(List<CartItemDTO> cartItems, LocalDate releaseDate, String memo) {
		// JWT 토큰에서 사용자 정보 추출
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName(); // 토큰에서 username 추출

		// 사용자 정보 확인
		Member member = memberRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

		// 주문 정보 생성
		Orders order = new Orders();
		order.setMember(member);
		order.setReleaseDate(releaseDate);
		order.setRequestDate(LocalDate.now());
		order.setMemo(memo); // memo 설정
		Orders savedOrder = ordersRepo.save(order);

		// OrderDetail 저장 및 장바구니에서 삭제
		for (CartItemDTO itemDetail : cartItems) {
			List<CartItem> cartItemList = cartItemRepo
					.findByItem_ItemsIdAndCart_Member_Username(itemDetail.getItemsId(), username);

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

				// 구매 횟수 증가
				Items item = cartItem.getItem();
				item.setPurchaseCount(item.getPurchaseCount() + 1);
				itemsRepo.save(item);

				// 장바구니에서 삭제
				cartItemRepo.delete(cartItem);
			}
		}

		return new OrdersDTO(savedOrder.getOrderId(), savedOrder.getMember().getUsername(),
				savedOrder.getMember().getAlias(), savedOrder.getMember().getPhone(), savedOrder.getReleaseDate(), null, // bestOrderDate는 여전히 계산되지 않았으므로
				savedOrder.getRequestDate(), savedOrder.getMemo(), // 저장된 memo 반환
				null);
	}

}
