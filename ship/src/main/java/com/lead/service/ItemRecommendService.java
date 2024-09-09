package com.lead.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lead.dto.ItemRecommendDTO;
import com.lead.repository.ItemsRepo;

@Service
public class ItemRecommendService {

    @Autowired
    private ItemsRepo itemsRepo;

    public List<ItemRecommendDTO> getRecommendedItems(Integer selectItemId, LocalDate releaseDate) {
        String releaseDateStr = releaseDate.toString();
        List<Object[]> results = itemsRepo.findAlternativeItems(selectItemId, releaseDateStr);

        List<ItemRecommendDTO> recommendedItems = new ArrayList<>();
        for (Object[] result : results) {
            Integer itemsId = (Integer) result[0];
            String itemName = (String) result[1];
            BigDecimal price = (BigDecimal) result[2];
            Integer leadtime = (Integer) result[3];

            // Calculate recommendedOrderDate
            LocalDate recommendedOrderDate = releaseDate.minusDays(leadtime);

            // Create DTO
            ItemRecommendDTO dto = new ItemRecommendDTO(itemsId, itemName, price, leadtime, recommendedOrderDate);
            recommendedItems.add(dto);
        }

        return recommendedItems;
    }
}
