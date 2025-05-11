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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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

    public String updateCustomerById(Long customerId, UpdateCustomerRequest updateCustomerRequest, MultipartFile file) {

        Customer customerToUpdate = customerRepository.findById(customerId)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı: " + customerId));


        if (updateCustomerRequest.getUsername() != null &&
                !customerToUpdate.getUsername().equals(updateCustomerRequest.getUsername()) &&
                customerRepository.existsByUsername(updateCustomerRequest.getUsername())) {
            throw new TakenUsernameException("Bu kullanıcı adı zaten kullanımda: " + updateCustomerRequest.getUsername());
        }


        if (updateCustomerRequest.getUsername() != null)
            customerToUpdate.setUsername(updateCustomerRequest.getUsername());
        if (updateCustomerRequest.getPhone() != null)
            customerToUpdate.setPhone(updateCustomerRequest.getPhone());
        if (updateCustomerRequest.getAddress() != null)
            customerToUpdate.setAddress(updateCustomerRequest.getAddress());


        if (updateCustomerRequest.getRole() != null && !updateCustomerRequest.getRole().trim().isEmpty()) {
            try {
                customerToUpdate.setRole(Role.valueOf(updateCustomerRequest.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Geçersiz rol: " + updateCustomerRequest.getRole() + ". Geçerli roller: " + java.util.Arrays.stream(Role.values()).map(Enum::name).collect(java.util.stream.Collectors.joining(", ")));
            }
        }

        if (file != null && !file.isEmpty()) {
            String fileName = file.getOriginalFilename();
            if (fileName != null && !fileName.trim().isEmpty()) {

                String filename = System.currentTimeMillis() + "_" + fileName;
                String uploadDir = "src/main/resources/static/users/";
                Path uploadPath = Paths.get(uploadDir);
                Path filePath = uploadPath.resolve(filename);

                try {

                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }


                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    customerToUpdate.setImageUrl("/users/" + filename);

                } catch (IOException ex) {

                    throw new RuntimeException("Dosya kaydedilirken bir hata oluştu: " + ex.getMessage(), ex);
                }
            }
        }

        customerRepository.save(customerToUpdate);

        return String.format("Customer with the username: %s has been updated successfully.", customerToUpdate.getUsername());
    }



}