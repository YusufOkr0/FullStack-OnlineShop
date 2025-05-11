package com.swe212.onlineshop.service;

import com.swe212.onlineshop.dtos.CustomerDto;
import com.swe212.onlineshop.dtos.request.UpdateCustomerRequest;
import com.swe212.onlineshop.entity.Customer;
import com.swe212.onlineshop.entity.Role;
import com.swe212.onlineshop.exception.TakenUsernameException;
import com.swe212.onlineshop.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final ModelMapper modelMapper;

    public List<CustomerDto> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();

        return customers
                .stream()
                .map(customer -> modelMapper.map(customer, CustomerDto.class))
                .toList();
    }

    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı: " + id));

        return modelMapper.map(customer,CustomerDto.class);
    }

    public String deleteCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı: " + id));

        customerRepository.delete(customer);
        return String.format("User with the id %s has been deleted successfully.",id);
    }

    public String updateCustomerById(Long id, UpdateCustomerRequest updateCustomerRequest) {
        Customer customerToUpdate = customerRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı: " + id));

        if (!customerToUpdate.getUsername().equals(updateCustomerRequest.getUsername()) &&
                customerRepository.existsByUsername(updateCustomerRequest.getUsername())) {
            throw new TakenUsernameException("Bu kullanıcı adı zaten kullanımda: " + updateCustomerRequest.getUsername());
        }

        customerToUpdate.setUsername(updateCustomerRequest.getUsername());
        customerToUpdate.setPassword(updateCustomerRequest.getPassword());
        customerToUpdate.setPhone(updateCustomerRequest.getPhone());
        customerToUpdate.setAddress(updateCustomerRequest.getAddress());

        if (updateCustomerRequest.getImageUrl() != null) {
            customerToUpdate.setImageUrl(updateCustomerRequest.getImageUrl());
        }

        if (updateCustomerRequest.getRole() != null) {
            try {
                customerToUpdate.setRole(Role.valueOf(updateCustomerRequest.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Geçersiz rol: " + updateCustomerRequest.getRole());
            }
        }

        customerRepository.save(customerToUpdate);

        return String.format("Customer with the username: %s has been updated successfully.", updateCustomerRequest.getUsername());
    }


}