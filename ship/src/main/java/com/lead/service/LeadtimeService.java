package com.lead.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.lead.entity.Items;
import com.lead.entity.Member;
import com.lead.repository.ItemsRepo;
import com.lead.repository.LeadtimeRepo;

@Service
public class LeadtimeService {

    @Autowired
    private ItemsRepo itemsRepo;
    
    @Autowired
    private LeadtimeRepo leadtimeRepo;

    @Autowired
    private RestTemplate restTemplate;

    // DB에서 데이터를 조회하고 Flask API로 보낼 로직
    public void sendLeadtimeDataToFlask() {
        // 오늘 날짜 (requestDate)
        LocalDate requestDate = LocalDate.now();

        // 이번 년도의 4개 releaseDate
        LocalDate[] releaseDates = {
            LocalDate.of(requestDate.getYear(), 3, 1),
            LocalDate.of(requestDate.getYear(), 6, 1),
            LocalDate.of(requestDate.getYear(), 9, 1),
            LocalDate.of(requestDate.getYear(), 12, 1)
        };

        // Items 테이블에서 데이터를 조회하여 관련된 supplier, machinery, assembly, currency 값을 구성
        List<Items> itemsList = itemsRepo.findAll();  // 모든 Items 조회

        for (Items item : itemsList) {
            // supplier: Items의 user_id와 연결된 Member의 username
            Member member = item.getMember(); // item을 통해 바로 member를 가져옴
            String supplier = member.getUsername();

            // machinery: Item을 통해 Category2의 category2Name 값
            String machinery = item.getCategory3().getCategory2().getCategory2Name();

            // assembly: Item을 통해 Category3의 category3_name 값
            String assembly = item.getCategory3().getCategory3Name();

            // currency: Items 테이블의 unit 값
            String currency = item.getUnit();

            // releaseDate 4개 각각에 대해 Flask API 호출
            for (LocalDate releaseDate : releaseDates) {
                // Flask API로 보낼 요청 데이터 구성
                Map<String, Object> requestData = new HashMap<>();
                requestData.put("requestDate", requestDate.toString());
                requestData.put("releaseDate", releaseDate.toString());
                requestData.put("supplier", supplier);
                requestData.put("machinery", machinery);
                requestData.put("assembly", assembly);
                requestData.put("currency", currency);

                // Flask API 호출
                String flaskApiUrl = "http://10.125.121.178:5000/predict_leadtime";  // Flask API 엔드포인트 수정
                sendRequestToFlask(flaskApiUrl, requestData);
            }
        }
    }

    // Flask API로 데이터를 전송하는 메서드
    private void sendRequestToFlask(String flaskApiUrl, Map<String, Object> requestData) {
        // Flask API로 POST 요청 보내기
        ResponseEntity<String> response = restTemplate.postForEntity(flaskApiUrl, requestData, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            System.out.println("Flask API 호출 성공: " + response.getBody());
        } else {
            throw new RuntimeException("Flask API 호출 실패");
        }
    }
}
