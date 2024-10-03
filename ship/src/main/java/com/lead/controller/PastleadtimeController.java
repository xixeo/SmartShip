package com.lead.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.lead.dto.PastleadtimeDTO;
import com.lead.service.PastleadtimeService;

@RestController
public class PastleadtimeController {

    @Autowired
    private PastleadtimeService pastLeadTimeService;

    @GetMapping("/pasttime/{itemsId}")
    public ResponseEntity<List<PastleadtimeDTO>> getPastLeadTime(@PathVariable Integer itemsId) {
        List<PastleadtimeDTO> pastLeadTimes = pastLeadTimeService.getPastLeadTimeByItemsId(itemsId);
        return ResponseEntity.ok(pastLeadTimes);
    }
}