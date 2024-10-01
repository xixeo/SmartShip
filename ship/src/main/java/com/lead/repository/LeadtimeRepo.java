package com.lead.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lead.entity.Leadtime;
import com.lead.entity.SelectedDay;

@Repository
public interface LeadtimeRepo extends JpaRepository<Leadtime, Integer> {

	Optional<Leadtime> findByItems_ItemsId(Integer itemsId);


    @Query("SELECT l FROM Leadtime l WHERE l.items.itemsId = :itemsId AND l.selectedDay = :selectedDay AND "
           + "((MONTH(:releaseDate) IN (3, 4, 5) AND l.season = 'SPRING') OR "
           + "(MONTH(:releaseDate) IN (6, 7, 8) AND l.season = 'SUMMER') OR "
           + "(MONTH(:releaseDate) IN (9, 10, 11) AND l.season = 'FALL') OR "
           + "(MONTH(:releaseDate) IN (12, 1, 2) AND l.season = 'WINTER'))")
    List<Leadtime> findLeadtimeByItemsIdAndSelectedDayAndSeason(
        @Param("itemsId") Integer itemsId,
        @Param("selectedDay") SelectedDay selectedDay,
        @Param("releaseDate") LocalDate releaseDate);
    
    
//    Optional<Leadtime> findByItemId(Long itemId);
}
