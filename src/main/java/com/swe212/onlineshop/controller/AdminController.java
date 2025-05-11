package com.swe212.onlineshop.controller;

import com.swe212.onlineshop.dtos.request.AddAdminRequest;
import com.swe212.onlineshop.dtos.request.RegisterRequest;
import com.swe212.onlineshop.dtos.response.RegisterResponse;
import com.swe212.onlineshop.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;


    @PostMapping("/add")
    public ResponseEntity<?> register(
            @RequestBody AddAdminRequest request
    ) {
        RegisterResponse response = adminService.addAdmin(request);

        return ResponseEntity
                .ok(response);
    }
}
