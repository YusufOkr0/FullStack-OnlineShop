package com.swe212.onlineshop.dtos;

import com.swe212.onlineshop.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {

    private LocalDateTime date;

    private String city;

    private String status;

    private Product products;
}
