package com.lead.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lead.service.LeadtimeService;

@RestController
public class LeadtimeController {

    @Autowired
    private LeadtimeService leadtimeService;

    // 클라이언트 요청 시 Flask API로 리드타임 데이터를 전송하는 엔드포인트
    @PostMapping("/send")
    public ResponseEntity<String> sendLeadtimeData() {
        // Flask API로 리드타임 데이터를 전송하는 서비스 호출
        leadtimeService.sendLeadtimeDataToFlask();
        return ResponseEntity.ok("리드타임 데이터가 Flask로 성공적으로 전송되었습니다.");
    }
}