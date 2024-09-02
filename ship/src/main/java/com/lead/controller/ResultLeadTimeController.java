package com.lead.controller;

import com.lead.entity.ResultLeadTime;
import com.lead.service.ResultLeadTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resultLeadTimes")
public class ResultLeadTimeController {

    @Autowired
    private ResultLeadTimeService resultLeadTimeService;

    @GetMapping
    public ResponseEntity<List<ResultLeadTime>> getAllResultLeadTimes() {
        List<ResultLeadTime> resultLeadTimes = resultLeadTimeService.getAllResultLeadTimes();
        return new ResponseEntity<>(resultLeadTimes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultLeadTime> getResultLeadTimeById(@PathVariable int id) {
        Optional<ResultLeadTime> resultLeadTime = resultLeadTimeService.getResultLeadTimeById(id);
        return resultLeadTime.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                             .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<ResultLeadTime> createResultLeadTime(@RequestBody ResultLeadTime resultLeadTime) {
        ResultLeadTime savedResultLeadTime = resultLeadTimeService.saveResultLeadTime(resultLeadTime);
        return new ResponseEntity<>(savedResultLeadTime, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultLeadTime> updateResultLeadTime(@PathVariable int id, @RequestBody ResultLeadTime resultLeadTime) {
        Optional<ResultLeadTime> existingResultLeadTime = resultLeadTimeService.getResultLeadTimeById(id);
        if (existingResultLeadTime.isPresent()) {
            resultLeadTime.setRltId(id);
            ResultLeadTime updatedResultLeadTime = resultLeadTimeService.saveResultLeadTime(resultLeadTime);
            return new ResponseEntity<>(updatedResultLeadTime, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResultLeadTime(@PathVariable int id) {
        resultLeadTimeService.deleteResultLeadTime(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
