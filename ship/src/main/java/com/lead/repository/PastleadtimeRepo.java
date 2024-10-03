package com.lead.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lead.entity.Pastleadtime;

@Repository
public interface PastleadtimeRepo extends JpaRepository<Pastleadtime, Integer> {
    List<Pastleadtime> findByItems_ItemsId(Integer itemsId);
}