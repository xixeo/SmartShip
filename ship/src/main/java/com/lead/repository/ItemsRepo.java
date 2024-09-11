package com.lead.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lead.entity.Items;

@Repository
public interface ItemsRepo extends JpaRepository<Items, Integer>, JpaSpecificationExecutor<Items> {

	@Query(value = """
            SELECT
                i.items_id,
                i.item_name,
                i.price,
                l.leadtime
            FROM
                Items i
            JOIN
                Leadtime l ON i.items_id = l.items_id
            WHERE
                i.category3_id = (SELECT category3_id FROM Items WHERE items_id = :selectItemId)
                AND (i.price BETWEEN (SELECT price * 0.9 FROM Items WHERE items_id = :selectItemId) AND (SELECT price * 1.1 FROM Items WHERE items_id = :selectItemId))
                AND i.items_id <> :selectItemId
                AND l.leadtime <= (SELECT DATEDIFF(:releaseDate, CURRENT_DATE))
            ORDER BY
                ABS(i.price - (SELECT price FROM Items WHERE items_id = :selectItemId)) ASC
            LIMIT 4
        """, nativeQuery = true)
    List<Object[]> findAlternativeItems(@Param("selectItemId") Integer selectItemId,
                                        @Param("releaseDate") String releaseDate);
    
    // 특정 아이템의 구매 횟수 증가
    @Modifying
    @Query("UPDATE Items i SET i.purchaseCount = i.purchaseCount + 1 WHERE i.itemsId = :itemsId")
    void incrementPurchaseCount(@Param("itemsId") Integer itemsId);

}