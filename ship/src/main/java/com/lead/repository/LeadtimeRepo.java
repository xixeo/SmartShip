package com.lead.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lead.entity.Leadtime;

@Repository
public interface LeadtimeRepo extends JpaRepository<Leadtime, Integer> {
    Optional<Leadtime> findByItems_ItemsId(Integer itemsId);
}