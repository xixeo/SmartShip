package com.lead.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDTO {

	private Integer noticeId;
	
	private String title;

	private String content;

	private String author;

	private LocalDate createdAt;

	private LocalDate updatedAt;

	private Integer views;

	private Boolean status;

	private String attachment;
}
