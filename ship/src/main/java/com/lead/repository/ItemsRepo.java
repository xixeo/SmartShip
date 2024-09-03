package com.lead.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.lead.entity.Items;

// SQL사용하는 방법
//@Repository
//public interface ItemsRepo extends JpaRepository<Items, Integer> {
//
//    @Query("SELECT new com.lead.dto.ItemsDTO(i.itemName, c1.categoryName, c2.category2Name, i.part1, i.part2, i.price, i.unit, s.supplierName) " +
//           "FROM Items i " +
//           "JOIN i.category2 c2 " +
//           "JOIN c2.category1 c1 " +
//           "JOIN i.supplier s")
//    List<ItemsDTO> findAllItemsDetails();
//}


public interface ItemsRepo extends JpaRepository<Items, Integer> {
	
	// 한번만 조회했는데도 5번씩 타길래 삽입.
	@EntityGraph(attributePaths = {"category2", "category2.category1", "supplier"})
    List<Items> findByItemNameContaining(String itemName);
}