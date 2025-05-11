package com.swe212.onlineshop.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCustomerRequest {
    private String username;
    private String password;
    private String phone;
    private String address;
    private String imageUrl;
    private String role;
}
