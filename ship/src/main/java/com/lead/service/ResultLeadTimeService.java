package com.lead.service;

import com.lead.entity.ResultLeadTime;
import com.lead.repository.ResultLeadTimeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResultLeadTimeService {

    @Autowired
    private ResultLeadTimeRepo resultLeadTimeRepo;

    public List<ResultLeadTime> getAllResultLeadTimes() {
        return resultLeadTimeRepo.findAll();
    }

    public Optional<ResultLeadTime> getResultLeadTimeById(int id) {
        return resultLeadTimeRepo.findById(id);
    }

    public ResultLeadTime saveResultLeadTime(ResultLeadTime resultLeadTime) {
        return resultLeadTimeRepo.save(resultLeadTime);
    }

    public void deleteResultLeadTime(int id) {
        resultLeadTimeRepo.deleteById(id);
    }
}
