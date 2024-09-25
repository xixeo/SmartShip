package com.lead.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lead.entity.OrderDetail;

@Repository
public interface OrderDetailRepo extends JpaRepository<OrderDetail, Integer> {

	@EntityGraph(attributePaths = { "item", "item.member.alias", "item.category3", "item.category3.category2",
			"item.category3.category2.category1" })
	List<OrderDetail> findByOrderOrderId(Integer orderId);
	
	   // OrderId로 OrderDetail 조회 (cancel=false 인 항목만)
    List<OrderDetail> findByOrderOrderIdAndCancelFalse(Integer orderId);
	
	//List<OrderDetail> findByOrder_Member_Username(String username);

	// OrderDetail 엔티티를 조회할 때, 연관된 Items 또는 Orders 엔티티를 참조할 수 있다. 각 엔티티마다 별도의 쿼리가
	// 발생.
	// 예를 들어, OrderDetail에서 Items를 가져올 때마다 별도의 쿼리가 실행되어 Items가 여러 번 조회된다.
	// 그걸 방지하고자 @EntityGraph를 설정해준다 -> findByOrderId 메서드를 호출할 때 OrderDetail과 함께
	// item도 한 번에 로딩하게 되어 불필요한 추가 쿼리를 방지
	// 그것도 별로라면 sql문 써야한다..

}