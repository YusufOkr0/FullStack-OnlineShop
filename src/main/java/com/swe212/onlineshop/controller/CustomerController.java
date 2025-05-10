package com.swe212.onlineshop.controller;

import com.swe212.onlineshop.dtos.CustomerDto;
import com.swe212.onlineshop.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/")
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


}