package com.passion2code.booking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "decor_items")
@Data
public class DecorItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double pricePerDay;
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "decor_item_images", joinColumns = @JoinColumn(name = "decor_item_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    @Column(nullable = false)
    private boolean active = true;
}
