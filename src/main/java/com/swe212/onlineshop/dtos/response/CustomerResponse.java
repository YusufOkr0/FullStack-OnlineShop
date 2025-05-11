package com.swe212.onlineshop.dtos.response;

import com.swe212.onlineshop.dtos.OrderDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerResponse {

    private Long id;

    private String username;

    private String address;

    private String phone;

    private String role;

    private String imageUrl;
    private List<OrderDto> orders;
}
