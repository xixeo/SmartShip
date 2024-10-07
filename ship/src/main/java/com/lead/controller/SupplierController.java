package com.lead.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.ManagerOrderDTO;
import com.lead.dto.ManagerOrderDetailDTO;
import com.lead.entity.OrderDetail;
import com.lead.repository.MemberRepo;
import com.lead.repository.OrderDetailRepo;

@RestController
public class SupplierController {

    private final OrderDetailRepo orderDetailRepo;
    private final MemberRepo memberRepo;

    // 생성자 주입
    public SupplierController(OrderDetailRepo orderDetailRepo, MemberRepo memberRepo) {
        this.orderDetailRepo = orderDetailRepo;
        this.memberRepo = memberRepo;
    }

    // Supplier가 자신의 주문 내역을 조회하는 엔드포인트
    @GetMapping("/supplierOrder")
    public ResponseEntity<ManagerOrderDTO> getSupplierOrdersGroupedByDate(Authentication authentication) {

        // 현재 사용자가 supplier인지 확인
        if (authentication.getAuthorities().stream()
                .noneMatch(auth -> auth.getAuthority().equals("ROLE_SUPPLIER"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        // 현재 로그인된 사용자의 user_id를 가져옴
        String supplierUserId = authentication.getName();

        // 주문 내역 조회 (user_id로 1차 필터링 후 ordering = true인 항목들)
        List<OrderDetail> orderDetails = orderDetailRepo.findAllByItem_Member_IdAndOrderingTrue(supplierUserId);

        // OrderDetail을 DTO로 변환하고, order_date로 그룹화
        Map<LocalDate, List<ManagerOrderDetailDTO>> groupedOrderDetails = orderDetails.stream()
                .filter(orderDetail -> orderDetail.getOrderDate() != null) // orderDate가 null이 아닌 것만 처리
                .map(orderDetail -> new ManagerOrderDetailDTO(
                        orderDetail.getOrderDetailId(),
                        orderDetail.getItem().getItemsId(),
                        orderDetail.getItem().getItemName(),
                        orderDetail.getItem().getPart1(),
                        orderDetail.getItem().getPrice(),
                        orderDetail.getItem().getUnit(),
                        orderDetail.getQuantity(),
                        orderDetail.getItem().getMember().getUsername(),
                        orderDetail.getOrderDate()
                ))
                .collect(Collectors.groupingBy(ManagerOrderDetailDTO::getOrderDate)); // orderDate로 그룹화

        // 결과를 ManagerOrderDTO로 반환
        ManagerOrderDTO response = new ManagerOrderDTO(null, supplierUserId, null, null, null, null, groupedOrderDetails);

        return ResponseEntity.ok(response);
    }
}
