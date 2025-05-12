package com.swe212.onlineshop.service;

import com.swe212.onlineshop.dtos.request.LoginRequest;
import com.swe212.onlineshop.dtos.request.RegisterRequest;
import com.swe212.onlineshop.dtos.response.LoginResponse;
import com.swe212.onlineshop.dtos.response.RegisterResponse;
import com.swe212.onlineshop.entity.Customer;
import com.swe212.onlineshop.entity.Role;
import com.swe212.onlineshop.exception.TakenUsernameException;
import com.swe212.onlineshop.repository.CustomerRepository;
import com.swe212.onlineshop.security.JwtService;
import com.swe212.onlineshop.util.ImageLoader;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthService {

    public static final String PHOTO_URL = "images/no-user-photo.png";


    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;

    public RegisterResponse register(RegisterRequest request) {

        if (customerRepository.existsByUsername(request.getUsername())) {
            throw new TakenUsernameException(String.format("Username %s is taken.", request.getUsername()));
        }

        ImageLoader.ImageData customerImageData = ImageLoader.loadImageData(PHOTO_URL);

        Customer newCustomer = Customer
                .builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(Role.CUSTOMER)
                .imageBytes(customerImageData.bytes)
                .imageName(customerImageData.name)
                .imageType(customerImageData.type)
                .orders(new ArrayList<>())
                .build();

        customerRepository.save(newCustomer);

        return RegisterResponse
                .builder()
                .message(String.format("Hello %s. Welcome to Online Shop",request.getUsername()))
                .build();
    }

    public LoginResponse login(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        UserDetails userDetails = ((UserDetails) authentication.getPrincipal());

        String jwtToken = jwtService.generateToken(userDetails);

        Customer customer = customerRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException(String.format("Username %s not found.", request.getUsername())));


        return LoginResponse
                .builder()
                .token(jwtToken)
                .userId(customer.getId())
                .build();
    }
}
