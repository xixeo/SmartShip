package com.lead.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lead.entity.Category3;

public interface Category3Repo extends JpaRepository<Category3, Integer> {

    Optional<Category3> findByCategory3Name(String category3Name);

}
