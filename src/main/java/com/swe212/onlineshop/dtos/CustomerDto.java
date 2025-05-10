package com.swe212.onlineshop.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDto {

    private Long id;

    private String name;

    private String address;

    private String phone;

    private String role;

    private List<OrderDto> orders;
}