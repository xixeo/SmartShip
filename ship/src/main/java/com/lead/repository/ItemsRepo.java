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

    // 대체상품추천
    @Query(value = """
        SELECT
            i.items_id,
            i.item_name,
            i.price,
            i.unit,
            m.username AS supplierName, -- member 테이블의 username을 supplierName으로 가져옴
            l.leadtime
        FROM
            Items i
        JOIN
            Leadtime l ON i.items_id = l.items_id
        JOIN
            member m ON i.user_id = m.id -- Items 테이블의 user_id와 member 테이블의 id를 연결
        WHERE
            i.category3_id = (SELECT category3_id FROM Items WHERE items_id = :selectItemId)
            AND (i.price BETWEEN (SELECT price * 0.9 FROM Items WHERE items_id = :selectItemId) AND (SELECT price * 1.1 FROM Items WHERE items_id = :selectItemId))
            AND i.items_id <> :selectItemId
            AND i.enabled = true -- enabled 필터 추가
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
