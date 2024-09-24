package com.lead.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
			return notices.stream().map(this::convertToDTOwithStatus).collect(Collectors.toList());
		} else {
			// ROLE_ADMIN이 아닌 경우 status가 1인 공지사항만 조회
			notices = noticeRepo.findByStatusTrue();
			return notices.stream().map(this::convertToDTOwithoutStatus).collect(Collectors.toList());
		}
	}

	// ROLE_ADMIN용 NoticeDTO로 변환하는 메서드
	private NoticeDTO convertToDTOwithStatus(Notice notice) {
		return NoticeDTO.builder().noticeId(notice.getNoticeId()).title(notice.getTitle())
				.author(notice.getAuthor().getUsername()).createdAt(notice.getCreatedAt().toLocalDate()) // 날짜만 반환
				.views(notice.getViews()).status(notice.getStatus()).build();
	}
	
	// 일반 사용자용 NoticeDTO로 변환하는 메서드
	private NoticeDTO convertToDTOwithoutStatus(Notice notice) {
		return NoticeDTO.builder().noticeId(notice.getNoticeId()).title(notice.getTitle())
				.author(notice.getAuthor().getUsername()).createdAt(notice.getCreatedAt().toLocalDate()) // 날짜만 반환
				.views(notice.getViews()).build();
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
	public void createNotice(String title, String content, MultipartFile[] files, String username, Authentication authentication) throws IOException {
		List<String> fileNames = new ArrayList<>();

		// 현재 사용자의 권한이 ROLE_ADMIN이 아닌 경우 예외 발생
	    if (authentication.getAuthorities().stream()
	            .noneMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
	        throw new RuntimeException("공지사항 등록 권한이 없습니다.");
	    }

		if (files != null) {
			for (MultipartFile file : files) {
				if (!file.isEmpty()) {
					String fileName = fileService.storeFile(file);
					fileNames.add(fileName);
				}
			}
		}

		// 작성자 정보 가져오기
		Member author = memberRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("작성자를 찾을 수 없습니다."));

		// Notice 엔티티 생성
		Notice notice = Notice.builder().title(title).content(content).author(author).status(true).views(0)
				.attachment(String.join(",", fileNames)) // 파일 이름 저장
				.build();

		// 공지사항 저장
		noticeRepo.save(notice);
	}

	/////////////////////////////////////////////////////////// notice 삭제
	public void deleteNotice(List<Integer> noticeIds, String username) {

		for (Integer noticeId : noticeIds) {

			// 공지사항 조회
			Notice notice = noticeRepo.findById(noticeId)
					.orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다. ID: " + noticeId));

			// 현재 사용자(공급자)가 이 물품의 소유자인지 확인
			if (!notice.getAuthor().getUsername().equals(username)) {
				throw new RuntimeException("해당 물품을 수정할 권한이 없습니다.");
			}

			// 첨부파일 삭제 (필요할 경우)
			if (notice.getAttachment() != null) {
				String[] fileNames = notice.getAttachment().split(",");
				for (String fileName : fileNames) {
					fileService.deleteFile(fileName); // 파일 삭제
				}
			}

			// 공지사항 삭제
			noticeRepo.delete(notice);
		}
	}

	/////////////////////////////////////////////////////////// notice 수정
	@Transactional
	public void updateNotice(Integer noticeId, String title, String content, Boolean status, MultipartFile file, String username) {
	    // noticeId로 공지사항 조회
	    Notice notice = noticeRepo.findById(noticeId)
	            .orElseThrow(() -> new RuntimeException("해당 공지사항을 찾을 수 없습니다."));

	    // 현재 사용자가 작성자인지 확인
	    if (!notice.getAuthor().getUsername().equals(username)) {
	        throw new RuntimeException("공지사항을 수정할 권한이 없습니다.");
	    }

	    // 제목 및 내용 업데이트
	    notice.setTitle(title);
	    notice.setContent(content);
	    notice.setStatus(status);

	    // 파일이 있을 경우 파일 저장 및 업데이트
	    if (file != null && !file.isEmpty()) {
	        try {
	            String fileName = fileService.storeFile(file);  // IOException 처리
	            notice.setAttachment(fileName);
	        } catch (IOException e) {
	            throw new RuntimeException("파일 저장 중 오류가 발생했습니다.", e);
	        }
	    }

	    noticeRepo.save(notice);
	}
}
