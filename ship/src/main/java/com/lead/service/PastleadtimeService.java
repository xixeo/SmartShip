package com.lead.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.dto.PastleadtimeDTO;
import com.lead.entity.Pastleadtime;
import com.lead.repository.PastleadtimeRepo;

@Service
public class PastleadtimeService {

    @Autowired
    private PastleadtimeRepo pastLeadTimeRepository;

    public List<PastleadtimeDTO> getPastLeadTimeByItemsId(Integer itemsId) {
        List<Pastleadtime> pastLeadTimes = pastLeadTimeRepository.findByItems_ItemsId(itemsId);
        return pastLeadTimes.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private PastleadtimeDTO convertToDTO(Pastleadtime pastLeadTime) {
        return new PastleadtimeDTO(
        		pastLeadTime.getPastleadtimeId(),
                pastLeadTime.getItems().getItemsId(),
                pastLeadTime.getPastleadtime(),
                pastLeadTime.getOrderDate(),
                pastLeadTime.getArrDate()
        );
    }
}
