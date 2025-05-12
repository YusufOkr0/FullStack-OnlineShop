package com.swe212.onlineshop.service;

import com.swe212.onlineshop.dtos.request.AddAdminRequest;
import com.swe212.onlineshop.dtos.response.RegisterResponse;
import com.swe212.onlineshop.entity.Customer;
import com.swe212.onlineshop.entity.Role;
import com.swe212.onlineshop.exception.TakenUsernameException;
import com.swe212.onlineshop.repository.CustomerRepository;
import com.swe212.onlineshop.util.ImageLoader;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AdminService {
    public static final String PHOTO_URL = "static/no-user-photo.png";

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterResponse addAdmin(AddAdminRequest request) {

        if (customerRepository.existsByUsername(request.getUsername())) {
            throw new TakenUsernameException(String.format("Username %s is taken.", request.getUsername()));
        }

        ImageLoader.ImageData customerImageData = ImageLoader.loadImageData(PHOTO_URL);

        // CUSTOMER CLASS REPRESENTS CUSTOMER AND ADMIN BOTH.
        Customer admin = Customer
                .builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(Role.ADMIN)
                .imageBytes(customerImageData.bytes)
                .imageName(customerImageData.name)
                .imageType(customerImageData.type)
                .orders(new ArrayList<>())
                .build();

        customerRepository.save(admin);

        return RegisterResponse
                .builder()
                .message(String.format("Hello %s. Welcome to Online Shop",request.getUsername()))
                .build();
    }


}
