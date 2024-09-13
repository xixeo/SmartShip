package com.lead.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lead.entity.Category3;

public interface Category3Repo extends JpaRepository<Category3, Integer> {

    @Query("SELECT c3 FROM Category3 c3 " +
           "JOIN c3.category2 c2 " +
           "JOIN c2.category1 c1 " +
           "WHERE c3.category3Name = :category3Name " +
           "AND c2.category2Name = :category2Name " +
           "AND c1.categoryName = :categoryName")
    Optional<Category3> findByCategoryNames(@Param("categoryName") String categoryName,
                                            @Param("category2Name") String category2Name,
                                            @Param("category3Name") String category3Name);
}
