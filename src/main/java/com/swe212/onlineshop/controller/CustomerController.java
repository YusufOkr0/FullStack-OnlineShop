package com.swe212.onlineshop.controller;

import com.swe212.onlineshop.dtos.CustomerDto;
import com.swe212.onlineshop.dtos.request.UpdateCustomerRequest;
import com.swe212.onlineshop.dtos.request.UpdateProductRequest;
import com.swe212.onlineshop.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<CustomerDto>> getAllCustomers(){
        List<CustomerDto> customerDto = customerService.getAllCustomers();
        return ResponseEntity
                .ok(customerDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable(value = "id") Long id){
        CustomerDto customerDto = customerService.getCustomerById(id);
        return ResponseEntity
                .ok(customerDto);
    }

    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<String> deleteCustomerById(@PathVariable(value = "id") Long id){
        String message = customerService.deleteCustomerById(id);

        return ResponseEntity
                .ok(message);
    }

    @PutMapping(value = "/updateById/{id}", consumes = "multipart/form-data")
    public ResponseEntity<String> updateCustomerById(
            @PathVariable(value = "id") Long customerId,
            @RequestPart("updateCustomerRequest") UpdateCustomerRequest updateCustomerRequest,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {

        String message = customerService.updateCustomerById(customerId, updateCustomerRequest, file);

        return ResponseEntity.ok(message);
    }


}