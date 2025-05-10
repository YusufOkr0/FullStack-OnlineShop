package com.swe212.onlineshop.repository;

import com.swe212.onlineshop.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer,Long> {

    Optional<Customer> findByName(String username);
}
