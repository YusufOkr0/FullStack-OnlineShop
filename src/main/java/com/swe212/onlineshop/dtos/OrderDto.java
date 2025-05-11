package com.swe212.onlineshop.dtos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {
    private Long id;
    private LocalDateTime date;
    private String city;
    private String status;
    @JsonBackReference
    private CustomerDto customer;
    private ProductDto product;
}
