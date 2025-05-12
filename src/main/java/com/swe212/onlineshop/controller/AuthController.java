package com.swe212.onlineshop.controller;

import com.swe212.onlineshop.dtos.request.LoginRequest;
import com.swe212.onlineshop.dtos.request.RegisterRequest;
import com.swe212.onlineshop.dtos.response.LoginResponse;
import com.swe212.onlineshop.dtos.response.RegisterResponse;
import com.swe212.onlineshop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {


    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @RequestBody RegisterRequest request
    ) {
        RegisterResponse response = authService.register(request);

        return ResponseEntity
                .ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {

        System.out.println("Login endpoint called.");
        LoginResponse response = authService.login(request);

        return ResponseEntity
                .ok(response);
    }
}
