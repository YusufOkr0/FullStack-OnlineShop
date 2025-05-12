package com.swe212.onlineshop.repository;

import com.swe212.onlineshop.entity.Order;
import com.swe212.onlineshop.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {

    List<Order> findByStatusAndDateBefore(OrderStatus status, LocalDateTime date);
}
