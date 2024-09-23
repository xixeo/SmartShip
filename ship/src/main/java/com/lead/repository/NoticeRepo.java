package com.lead.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lead.entity.Notice;

public interface NoticeRepo extends JpaRepository<Notice, Integer> {

	 List<Notice> findByStatusTrue();
}
