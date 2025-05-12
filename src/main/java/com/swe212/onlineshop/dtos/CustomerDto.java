package com.swe212.onlineshop.dtos;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDto {

    private Long id;

    private String username;

    private String address;

    private String phone;

    private String role;

    private boolean hasImage;

    @JsonManagedReference
    private List<OrderDto> orders;
}