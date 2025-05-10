package com.swe212.onlineshop.dtos;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String supplier;
    private BigDecimal price;
}
