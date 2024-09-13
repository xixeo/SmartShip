package com.lead.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.dto.Category1DTO;
import com.lead.dto.Category2DTO;
import com.lead.dto.Category3DTO;
import com.lead.entity.Category1;
import com.lead.entity.Category2;
import com.lead.entity.Category3;
import com.lead.repository.Category1Repo;
import com.lead.repository.Category2Repo;
import com.lead.repository.Category3Repo;

@Service
public class CategoryService {

	@Autowired
	private Category1Repo category1Repo;

	@Autowired
	private Category2Repo category2Repo;

	@Autowired
	private Category3Repo category3Repo;

	// Category1 목록을 가져오는 메서드
	public List<Category1DTO> getCategory1() {
		List<Category1> category1List = category1Repo.findAll();
		return category1List.stream().map(this::convertToCategory1DTO).collect(Collectors.toList());
	}

	// Category2 목록을 가져오는 메서드
	public List<Category2DTO> getCategory2() {
		List<Category2> category2List = category2Repo.findAll();
		return category2List.stream().map(this::convertToCategory2DTO).collect(Collectors.toList());
	}

	// Category3 목록을 가져오는 메서드
	public List<Category3DTO> getCategory3() {
		List<Category3> category3List = category3Repo.findAll();
		return category3List.stream().map(this::convertToCategory3DTO).collect(Collectors.toList());
	}

	// Category1 엔티티를 Category1DTO로 변환하는 메서드
	private Category1DTO convertToCategory1DTO(Category1 category1) {
		return Category1DTO.builder().category1Id(category1.getCategoryId()).category1Name(category1.getCategoryName())
				.build();
	}

	// Category2 엔티티를 Category2DTO로 변환하는 메서드
	private Category2DTO convertToCategory2DTO(Category2 category2) {
		// Category1DTO 생성 및 설정
		Category1DTO category1DTO = new Category1DTO();
		category1DTO.setCategory1Id(category2.getCategory1().getCategoryId());
		category1DTO.setCategory1Name(category2.getCategory1().getCategoryName());

		// Category2DTO 생성 및 설정
		Category2DTO category2DTO = new Category2DTO();
		category2DTO.setCategory2Id(category2.getCategory2Id());
		category2DTO.setCategory2Name(category2.getCategory2Name());
		category2DTO.setCategory1(category1DTO); // Category1 정보 포함

		return category2DTO;
	}

	// Category3 엔티티를 Category3DTO로 변환하는 메서드
	private Category3DTO convertToCategory3DTO(Category3 category3) {
		// Category2DTO 생성
		Category2DTO category2DTO = new Category2DTO();
		category2DTO.setCategory2Id(category3.getCategory2().getCategory2Id());
		category2DTO.setCategory2Name(category3.getCategory2().getCategory2Name());

		// Category1DTO는 설정하지 않음 (Category3 조회 시 제외)

		// Category3DTO 생성 및 설정
		Category3DTO category3DTO = new Category3DTO();
		category3DTO.setCategory3Id(category3.getCategory3Id());
		category3DTO.setCategory3Name(category3.getCategory3Name());
		category3DTO.setCategory2(category2DTO); // Category2 정보만 설정

		return category3DTO;
	}

}
