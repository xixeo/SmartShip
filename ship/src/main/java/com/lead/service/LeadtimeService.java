package com.lead.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lead.entity.Items;
import com.lead.entity.Leadtime;
import com.lead.entity.Member;
import com.lead.entity.Season;
import com.lead.entity.SelectedDay;
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

    private int i = 1; // 전송 카운트를 위한 변수

    // DB에서 데이터를 조회하고 Flask API로 보낼 로직 (1000개씩 나눠서)
    public void sendLeadtimeDataToFlask() {
        LocalDate requestDate = LocalDate.now();
        LocalDate[] releaseDates = {
            LocalDate.of(requestDate.getYear(), 3, 1),
            LocalDate.of(requestDate.getYear(), 6, 1),
            LocalDate.of(requestDate.getYear(), 9, 1),
            LocalDate.of(requestDate.getYear(), 12, 1)
        };

        String[] seasons = {"SPRING", "SUMMER", "FALL", "WINTER"};  // 4개의 시즌
        String[] selectedDays = {"월", "화", "수", "목", "금", "토", "일"};  // 7개의 요일

        int pageNumber = 0;
        int pageSize = 1000; // 한 번에 1000개의 데이터 조회
//        int startItemsId = 25909; // 25909번부터 시작
        int startItemsId = 29597; // 25909번부터 시작

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        
        boolean hasNextPage;
        do {
            // items_id가 25909 이상인 데이터만 조회
            List<Items> itemsList = itemsRepo.findItemsByItemsIdGreaterThanEqual(startItemsId, pageable);

            hasNextPage = !itemsList.isEmpty();

            for (Items item : itemsList) {
                Member member = item.getMember();
                String supplier = member.getUsername();
                String machinery = item.getCategory3().getCategory2().getCategory2Name();
                String assembly = item.getCategory3().getCategory3Name();
                String currency = item.getUnit();

                for (LocalDate releaseDate : releaseDates) {
                    for (String season : seasons) {
                        for (String selectedDay : selectedDays) {
                            Map<String, Object> requestData = new HashMap<>();
                            requestData.put("requestDate", requestDate.toString());
                            requestData.put("releaseDate", releaseDate.toString());
                            requestData.put("supplier", supplier);
                            requestData.put("machinery", machinery);
                            requestData.put("assembly", assembly);
                            requestData.put("currency", currency);
                            
                            // Flask API 호출 및 리드타임 데이터 응답 받음
                            String flaskApiUrl = "http://10.125.121.178:5001/predict_leadtime";  
                            String leadtime = sendRequestToFlask(flaskApiUrl, requestData);
                            
                            // 응답받은 데이터를 DB에 저장
                            saveLeadtimeToDb(item, leadtime, season, selectedDay);
                        }
                    }
                }
            }

            pageNumber++; // 다음 페이지로 이동

        } while (hasNextPage); // 다음 페이지가 있을 때까지 반복
    }

    // Flask API로 데이터를 전송하고 리드타임을 반환하는 메서드
    private String sendRequestToFlask(String flaskApiUrl, Map<String, Object> requestData) {
        ResponseEntity<String> response = restTemplate.postForEntity(flaskApiUrl, requestData, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            i++;  // i 값 증가
            System.out.println("Flask API 호출 성공: " + i + ", 응답: " + response.getBody());
            return response.getBody(); // 리드타임 값 반환
        } else {
            throw new RuntimeException("Flask API 호출 실패");
        }
    }

    // 응답받은 데이터를 Leadtime 테이블에 저장하는 메서드

    private void saveLeadtimeToDb(Items item, String leadtimeJson, String season, String selectedDay) {
        try {
            // JSON 응답을 파싱하여 predicted_lead_time 값 추출
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(leadtimeJson);
            int leadtime = jsonNode.get("predicted_lead_time").asInt(); // JSON에서 리드타임 값 추출

            // season과 selectedDay를 Enum으로 변환
            Season seasonEnum = Season.valueOf(season);
            SelectedDay selectedDayEnum = SelectedDay.valueOf(selectedDay);

            // items_id, season, selectedDay 조합으로 기존 데이터를 조회
            List<Leadtime> existingLeadtime = leadtimeRepo.findByItemsAndSeasonAndSelectedDay(item, seasonEnum, selectedDayEnum);

            Leadtime leadtimeEntity;

            if (existingLeadtime.isEmpty()) {
                // 해당 season, selectedDay가 존재하지 않으면 새 데이터를 추가
                leadtimeEntity = new Leadtime();
                leadtimeEntity.setItems(item);
                leadtimeEntity.setSeason(seasonEnum);
                leadtimeEntity.setSelectedDay(selectedDayEnum);
                leadtimeEntity.setLeadtime(leadtime); // 새로운 리드타임 설정
            } else {
                // 해당 season, selectedDay가 존재하면 leadtime만 업데이트
                leadtimeEntity = existingLeadtime.get(0); // 해당 조합이 존재하는 경우 첫 번째 데이터만 업데이트
                leadtimeEntity.setLeadtime(leadtime); // 리드타임 업데이트
            }

            // 리드타임 엔티티 저장 (업데이트 또는 신규 추가)
            leadtimeRepo.save(leadtimeEntity);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON response or update leadtime", e);
        }
    }
}

