package com.lead.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lead.entity.Items;

@Repository
public interface ItemsRepo extends JpaRepository<Items, Integer>, JpaSpecificationExecutor<Items> {

//	 @Query(value = "SELECT i.items_id AS itemsId, i.item_name AS itemName, i.price AS price, " +
//             "lt.leadtime AS leadtime, " +
//             "DATE_SUB(:releaseDate, INTERVAL lt.leadtime DAY) AS recommended_order_date " +
//             "FROM Items i " +
//             "JOIN Leadtime lt ON i.items_id = lt.items_id " +
//             "WHERE i.category3_id = (SELECT i2.category3_id FROM Items i2 WHERE i2.items_id = :selectedItemId) " +
//             "AND i.items_id <> :selectedItemId " +
//             "AND i.price BETWEEN " +
//             "(SELECT price * 0.9 FROM Items WHERE items_id = :selectedItemId) " +
//             "AND (SELECT price * 1.1 FROM Items WHERE items_id = :selectedItemId) " +
//             "AND DATE_SUB(:releaseDate, INTERVAL lt.leadtime DAY) <= :releaseDate", nativeQuery = true)
//List<ItemRecommendDTO> findRecommendedItems(@Param("selectedItemId") Integer selectedItemId,
//                                               @Param("releaseDate") LocalDate releaseDate);
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

}