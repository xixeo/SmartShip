package com.lead.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lead.entity.Items;

@Repository
public interface ItemsRepo extends JpaRepository<Items, Integer>, JpaSpecificationExecutor<Items> {


    // 대체상품추천    
	  @Query(value = """
		        SELECT
		            i.items_id,
		            i.item_name,
		            i.price,
		            i.unit,
		            m.username AS supplierName,
		            l.leadtime
		        FROM
		            Items i
		        JOIN
		            Leadtime l ON i.items_id = l.items_id
		        JOIN
		            member m ON i.user_id = m.id
		        WHERE
		            i.category3_id = (SELECT category3_id FROM Items WHERE items_id = :selectedItemId)
		            AND (i.price BETWEEN (SELECT price * 0.9 FROM Items WHERE items_id = :selectedItemId) 
		                AND (SELECT price * 1.1 FROM Items WHERE items_id = :selectedItemId))
		            AND i.items_id <> :selectedItemId
		            AND i.enabled = true
		            AND l.leadtime <= (DATEDIFF(:releaseDate, CURRENT_DATE))
		            AND l.season = (CASE
		                WHEN MONTH(:releaseDate) IN (3, 4, 5) THEN 'SPRING'
		                WHEN MONTH(:releaseDate) IN (6, 7, 8) THEN 'SUMMER'
		                WHEN MONTH(:releaseDate) IN (9, 10, 11) THEN 'FALL'
		                ELSE 'WINTER'
		            END)
		            AND l.selected_day = (SELECT selected_day FROM Orders WHERE order_id = :orderId)
		        ORDER BY
		            ABS(i.price - (SELECT price FROM Items WHERE items_id = :selectedItemId)) ASC
		        LIMIT 4
		    """, nativeQuery = true)
		    List<Object[]> findAlternativeItems(@Param("selectedItemId") Integer selectedItemId,
		                                         @Param("releaseDate") LocalDate releaseDate,
		                                         @Param("orderId") Integer orderId);

    // 특정 아이템의 구매 횟수 증가
    @Modifying
    @Query("UPDATE Items i SET i.purchaseCount = i.purchaseCount + 1 WHERE i.itemsId = :itemsId")
    void incrementPurchaseCount(@Param("itemsId") Integer itemsId);
    
    //1000개 제한
    @Query("SELECT i FROM Items i")
    List<Items> findLimitedItems(Pageable pageable);
    
    // itemsId 지정한 값의 이상만 보내고싶음
    @Query("SELECT i FROM Items i WHERE i.itemsId >= :startItemsId")
    List<Items> findItemsByItemsIdGreaterThanEqual(Integer startItemsId, Pageable pageable);
}
