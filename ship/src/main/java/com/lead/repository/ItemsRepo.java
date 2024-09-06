package com.lead.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

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

public interface ItemsRepo extends JpaRepository<Items, Integer>, JpaSpecificationExecutor<Items> {
}