package com.swe212.onlineshop.repository;

import com.swe212.onlineshop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order,Long> {
}
