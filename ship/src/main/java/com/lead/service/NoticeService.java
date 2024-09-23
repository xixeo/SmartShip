package com.lead.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.lead.dto.NoticeDTO;
import com.lead.entity.Member;
import com.lead.entity.Notice;
import com.lead.repository.MemberRepo;
import com.lead.repository.NoticeRepo;

@Service
public class NoticeService {
	
	@Autowired
	private MemberRepo memberRepo;

	@Autowired
	private NoticeRepo noticeRepo;

	@Autowired
	private FileService fileService;

	/////////////////////////////////////////////////////////// role에 따라 공지사항조회
	public List<NoticeDTO> getNoticesByRole(String role) {
		List<Notice> notices;
		if ("ROLE_ADMIN".equals(role)) {
			// ROLE_ADMIN인 경우 status 상관없이 모든 공지사항 조회
			notices = noticeRepo.findAll();
		} else {
			// ROLE_ADMIN이 아닌 경우 status가 1인 공지사항만 조회
			notices = noticeRepo.findByStatusTrue();
		}

		return notices.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	// Notice 엔티티를 NoticeDTO로 변환하는 메서드
	private NoticeDTO convertToDTO(Notice notice) {
		return NoticeDTO.builder().noticeId(notice.getNoticeId()).title(notice.getTitle())
				.author(notice.getAuthor().getUsername()).createdAt(notice.getCreatedAt().toLocalDate()) // 날짜만 반환
				.views(notice.getViews()).status(notice.getStatus()).build();
	}

	/////////////////////////////////////////////////////////// noticeId에 따른 content
	/////////////////////////////////////////////////////////// 조회
	public NoticeDTO getNoticeById(Integer noticeId) {
		Notice notice = noticeRepo.findById(noticeId).orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다."));

		// 조회수 증가
		notice.setViews(notice.getViews() + 1);
		noticeRepo.save(notice); // 조회수 업데이트 후 저장

		return convertToDTOWithContent(notice);
	}

	// Notice 엔티티를 NoticeDTO로 변환하는 메서드 (content 포함)
	private NoticeDTO convertToDTOWithContent(Notice notice) {
		return NoticeDTO.builder().noticeId(notice.getNoticeId()).title(notice.getTitle()).content(notice.getContent())
				.author(notice.getAuthor().getUsername()).createdAt(notice.getCreatedAt().toLocalDate())
				.views(notice.getViews()).status(notice.getStatus()).attachment("/files/" + notice.getAttachment())
				.build();
	}

	/////////////////////////////////////////////////////////// notice 등록
    public void createNotice(String title, String content, MultipartFile[] files, String username) throws IOException {
    	 List<String> fileNames = new ArrayList<>();
    	 
         if (files != null) {
        	 for(MultipartFile file : files) {
        		 if(!file.isEmpty()) {
        			 String fileName = fileService.storeFile(file);
        			 fileNames.add(fileName);        		 
        		 }           
        	 }
         }

         // 작성자 정보 가져오기
         Member author = memberRepo.findByUsername(username)
                 .orElseThrow(() -> new RuntimeException("작성자를 찾을 수 없습니다."));

        // Notice 엔티티 생성
        Notice notice = Notice.builder()
                .title(title)
                .content(content)
                .author(author)
                .status(true)
                .views(0)
                .attachment(String.join(",", fileNames))  // 파일 이름 저장
                .build();

        // 공지사항 저장
        noticeRepo.save(notice);
    }
}
