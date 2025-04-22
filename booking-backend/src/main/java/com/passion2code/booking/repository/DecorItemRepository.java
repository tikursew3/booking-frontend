package com.passion2code.booking.repository;

import com.passion2code.booking.entity.DecorItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DecorItemRepository extends JpaRepository<DecorItem, Long> {
    List<DecorItem> findByActiveTrue();

}
