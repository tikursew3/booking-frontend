package com.passion2code.booking.repository;

import com.passion2code.booking.entity.PhotographyService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotographyServiceRepository extends JpaRepository<PhotographyService, Long> {
    List<PhotographyService> findByActiveTrue();

}
