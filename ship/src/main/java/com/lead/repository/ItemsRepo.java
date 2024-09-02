package com.lead.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lead.entity.Items;

@Repository
public interface ItemsRepo extends JpaRepository<Items, Integer> {
    
    @Query("SELECT i FROM Items i JOIN Category2 c ON i.category2Id = c.category2Id " +
           "WHERE c.category1Id = :category1Id " +
           "AND (:category2Name IS NULL OR c.category2Name = :category2Name) " +
           "AND (:itemName IS NULL OR i.itemName = :itemName) " +
           "AND (:supplierId IS NULL OR i.supplierId = :supplierId)")
    List<Items> findByCategoryAndItem(@Param("category1Id") Integer category1Id,
                                      @Param("category2Name") String category2Name,
                                      @Param("itemName") String itemName,
                                      @Param("supplierId") Integer supplierId);
}
