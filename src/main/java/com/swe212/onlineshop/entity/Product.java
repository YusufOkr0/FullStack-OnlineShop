package com.swe212.onlineshop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "products")
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length=50, nullable=false)
    private String name;

    @Column(length=100, nullable=false)
    private String supplier;

    @Column(precision = 10, scale = 2 ,nullable = false)
    private BigDecimal price;

    @Column(length = 100)
    private String imageName;

    @Column(length = 50)
    private String imageType;

    @Lob
    @Column(name = "image_bytes")
    private byte[] imageBytes;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

}
