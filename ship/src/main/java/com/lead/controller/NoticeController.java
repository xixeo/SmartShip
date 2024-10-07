package com.lead.controller;

import java.net.URLEncoder;
import java.nio.file.Files;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.lead.dto.NoticeDTO;
import com.lead.entity.Member;
import com.lead.service.FileService;
import com.lead.service.MemberService;
import com.lead.service.NoticeService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class NoticeController {

	@Autowired
	private MemberService memberService;

	@Autowired
	private NoticeService noticeService;

	@Autowired
	private FileService fileService;

	// 역할에 따라 공지사항 조회
	@GetMapping("notice")
	public ResponseEntity<?> getNoticesByRole(Authentication authentication) {
		try {
			System.out.println("===========================공지사항 조회한다");
			// 인증된 사용자의 역할을 가져옴
			String role = authentication.getAuthorities().stream()
					.map(grantedAuthority -> grantedAuthority.getAuthority()).findFirst().orElse("ROLE_USER");

			List<NoticeDTO> notices = noticeService.getNoticesByRole(role);
			return ResponseEntity.ok(notices);

		} catch (Exception e) {
			// 예외 발생 시 오류 메시지와 500 Internal Server Error 반환
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("공지사항을 조회하는 중 오류가 발생했습니다: " + e.getMessage());
		}
	}

	// 특정 noticeId에 해당하는 공지사항 조회
	@GetMapping("notice/{noticeId}")
	public ResponseEntity<?> getNoticeById(@PathVariable Integer noticeId) {
		try {
			System.out.println("===========================공지사항 내용 조회한다");
			NoticeDTO notice = noticeService.getNoticeById(noticeId);
			return ResponseEntity.ok(notice); // 200 OK 상태와 함께 결과 반환

		} catch (RuntimeException e) {
			// 예외 발생 시 404 Not Found 반환
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("공지사항을 찾을 수 없습니다: " + e.getMessage());
		} catch (Exception e) {
			// 그 외의 예외 발생 시 500 Internal Server Error 반환
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("공지사항을 조회하는 중 오류가 발생했습니다: " + e.getMessage());
		}
	}

	// 첨부파일 다운로드
	@GetMapping("/noticeFile/{fileName}")
	public ResponseEntity<?> downloadFile(@PathVariable String fileName) {
	    try {
	        Resource file = fileService.loadFileAsResource(fileName);
	        String contentType = Files.probeContentType(file.getFile().toPath());
	        if (contentType == null) {
	            contentType = "application/octet-stream";
	        }

	        return ResponseEntity.ok()
	                .contentType(MediaType.parseMediaType(contentType))
	                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
	                .body(file);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일을 찾을 수 없습니다.");
	    }
	}


	// 공지 등록
	@PostMapping("/notice")
	public ResponseEntity<String> createNotice(@RequestParam("title") String title,
			@RequestParam("content") String content,
			@RequestParam(value = "file", required = false) MultipartFile[] files, Authentication authentication) {
		try {
			// 현재 로그인된 사용자 이름을 가져옴
			String username = authentication.getName();
			System.out.println("===========================공지 등록한다");
			// 공지사항 생성 로직
			noticeService.createNotice(title, content, files, username, authentication); // author를 추가로 전달
			return ResponseEntity.ok("공지사항이 성공적으로 등록되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("공지사항 등록 중 오류가 발생했습니다." + e.getMessage());
		}
	}

	// 공지사항 삭제
	@DeleteMapping("/noticeDelete")
	public ResponseEntity<String> deleteNotice(@RequestBody List<Integer> noticeIds) {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId = authentication.getName(); // 토큰에서 String 타입의 사용자 id 추출

		try {
			// String 타입의 userId로 사용자를 조회
			Member member = memberService.findMemberById(userId);

			// 공지사항 삭제 로직 호출
			noticeService.deleteNotice(noticeIds, member.getId()); // userId가 String 타입이면 그대로 사용
			System.out.println("===========================공지 삭제 한다");

			return ResponseEntity.ok("공지사항이 성공적으로 삭제되었습니다.");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("공지사항을 찾을 수 없습니다: " + e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("공지사항 삭제 중 오류가 발생했습니다: " + e.getMessage());
		}
	}

	// 공지사항 수정
	@PutMapping("/notice/{noticeId}")
	public ResponseEntity<String> updateNotice(@PathVariable Integer noticeId, @RequestParam("title") String title,
			@RequestParam("content") String content, @RequestParam("status") Boolean status,
			@RequestParam(value = "file", required = false) MultipartFile file, Authentication authentication) {
		String username = authentication.getName(); // 토큰에서 사용자 이름 가져오기

		try {
			// 공지사항 수정 로직 호출
			noticeService.updateNotice(noticeId, title, content, status, file, username);
			return ResponseEntity.ok("공지사항이 성공적으로 수정되었습니다.");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("공지사항 수정 중 오류가 발생했습니다." + e.getMessage());
		}
	}

	// 공지사항 노출여부 수정
	@PutMapping("/noticeStatus/{noticeId}")
	public ResponseEntity<String> updateNoticeState(@PathVariable Integer noticeId,
			@RequestParam("status") Boolean status, Authentication authentication) {
		// String username = authentication.getName(); // 토큰에서 사용자 이름 가져오기

		try {
			// 공지사항 수정 로직 호출
			noticeService.updateNoticeState(noticeId, status, authentication);
			return ResponseEntity.ok("공지사항이 성공적으로 수정되었습니다.");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("공지사항 수정 중 오류가 발생했습니다." + e.getMessage());
		}
	}
}
