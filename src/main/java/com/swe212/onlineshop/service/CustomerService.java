package com.swe212.onlineshop.service;

import com.swe212.onlineshop.dtos.CustomerDto;
import com.swe212.onlineshop.dtos.request.UpdateCustomerRequest;
import com.swe212.onlineshop.entity.Customer;
import com.swe212.onlineshop.entity.Role;
import com.swe212.onlineshop.exception.*;
import com.swe212.onlineshop.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;


@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final ModelMapper modelMapper;

    public List<CustomerDto> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();

        return customers
                .stream()
                .map(customer -> {
                    CustomerDto customerDto = modelMapper.map(customer, CustomerDto.class);
                    if (customer.getImageBytes() != null)
                        customerDto.setHasImage(true);
                    return customerDto;
                }
                ).toList();
    }

    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(String.format("User with the id %d not found: ", id)));

        CustomerDto customerDto = modelMapper.map(customer, CustomerDto.class);
        if (customer.getImageBytes() != null)
            customerDto.setHasImage(true);
        return customerDto;
    }

    public String deleteCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(String.format("User with the id %d not found: ", id)));

        UserDetails userFromContext = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        boolean IsUserFromContextAdmin = userFromContext
                .getAuthorities()
                .stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        String userFromContextUsername = userFromContext.getUsername();

        if (!IsUserFromContextAdmin && !customer.getUsername().equals(userFromContextUsername)) {
            throw new NotAllowedToDeleteCustomerException("You are not allowed to delete other users");
        }

        customerRepository.delete(customer);
        return String.format("User with the id %s has been deleted successfully.", id);
    }

    public String updateCustomerById(Long customerId, UpdateCustomerRequest updateCustomerRequest, MultipartFile file) {

        Customer customerToUpdate = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException(String.format("User with the id %d not found: ", customerId)));

        if (updateCustomerRequest != null) {
            String newUsername = updateCustomerRequest.getUsername();
            if (newUsername != null && !newUsername.trim().isEmpty()) {
                if (!Objects.equals(customerToUpdate.getUsername(), newUsername.trim())) {
                    if (customerRepository.existsByUsername(newUsername.trim())) {
                        throw new TakenUsernameException(String.format("Username: %s is taken.", newUsername));
                    }
                    customerToUpdate.setUsername(newUsername.trim());
                }
            }


            String newPhone = updateCustomerRequest.getPhone();
            if (newPhone != null && !newPhone.trim().isEmpty()) {
                customerToUpdate.setPhone(newPhone.trim());
            }

            String newAddress = updateCustomerRequest.getAddress();
            if (newAddress != null && !newAddress.trim().isEmpty()) {
                customerToUpdate.setAddress(newAddress.trim());
            }


            String newRole = updateCustomerRequest.getRole();
            if (newRole != null && !newRole.trim().isEmpty()) {
                try {
                    customerToUpdate.setRole(Role.valueOf(newRole.trim().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    String validRoles = Arrays.stream(Role.values())
                            .map(Enum::name)
                            .collect(java.util.stream.Collectors.joining(", "));
                    throw new IllegalArgumentException("Invalid role: '" + newRole + "'. Valid Roles are: " + validRoles);
                }
            }

        }


        if (file != null && !file.isEmpty()) {
            try {
                byte[] imageBytes = file.getBytes();
                String originalFilename = file.getOriginalFilename();
                String contentType = file.getContentType();

                customerToUpdate.setImageBytes(imageBytes);
                customerToUpdate.setImageName(originalFilename);
                customerToUpdate.setImageType(contentType);

            } catch (IOException e) {
                throw new ImageProcessException("Image Process Exception: " + e.getMessage());
            }
        }

        customerRepository.save(customerToUpdate);

        return String.format("Customer with the username: %s has been updated successfully.", customerToUpdate.getUsername());
    }


    public Customer getCustomerForImageById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(String.format("Customer with the id %d not found: ", id)));

        if (customer.getImageBytes() == null || customer.getImageType() == null) {
            throw new ImageNotFoundException(String.format("Customer with the id: %d does not have an image.", id));
        }

        return customer;
    }


}