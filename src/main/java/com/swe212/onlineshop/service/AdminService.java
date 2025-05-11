package com.swe212.onlineshop.service;

import com.swe212.onlineshop.dtos.request.RegisterRequest;
import com.swe212.onlineshop.dtos.response.RegisterResponse;
import com.swe212.onlineshop.entity.Customer;
import com.swe212.onlineshop.entity.Role;
import com.swe212.onlineshop.exception.TakenUsernameException;
import com.swe212.onlineshop.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterResponse addAdmin(RegisterRequest request) {

        if (customerRepository.existsByName(request.getUsername())) {
            throw new TakenUsernameException(String.format("Username %s is taken.", request.getUsername()));
        }

        // CUSTOMER CLASS REPRESENTS CUSTOMER AND ADMIN BOTH.
        Customer newCustomer = Customer
                .builder()
                .name(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(Role.ADMIN)
                .orders(new ArrayList<>())
                .build();

        customerRepository.save(newCustomer);

        return RegisterResponse
                .builder()
                .message(String.format("Hello %s. Welcome to Online Shop",request.getUsername()))
                .build();
    }


}
