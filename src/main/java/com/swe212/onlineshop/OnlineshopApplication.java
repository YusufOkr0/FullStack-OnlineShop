package com.swe212.onlineshop;

import com.swe212.onlineshop.entity.Customer;
import com.swe212.onlineshop.entity.Order;
import com.swe212.onlineshop.entity.Product;
import com.swe212.onlineshop.entity.Role;
import com.swe212.onlineshop.repository.CustomerRepository;
import com.swe212.onlineshop.repository.OrderRepository;
import com.swe212.onlineshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
@RequiredArgsConstructor
public class OnlineshopApplication implements CommandLineRunner {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    private final PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(OnlineshopApplication.class, args);
    }


    @Override
    public void run(String... args) throws Exception {

        if (customerRepository.count() == 0 &&
                productRepository.count() == 0 &&
                orderRepository.count() == 0
        ) {

            Customer admin = Customer.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin"))
                    .phone("555-555-5555")
                    .address("Admin Address")
                    .role(Role.ADMIN)
                    .orders(new ArrayList<>())
                    .build();
            Customer customer = Customer.builder()
                    .username("customer")
                    .password(passwordEncoder.encode("customer"))
                    .phone("222-222-2222")
                    .address("Customer Address")
                    .role(Role.CUSTOMER)
                    .orders(new ArrayList<>())
                    .build();

            customerRepository.save(admin);
            customerRepository.save(customer);

            List<Product> products = List.of(
                    Product.builder()
                            .name("Laptop")
                            .supplier("Dell")
                            .price(new BigDecimal("1200.00"))
                            .imageName(null)
                            .imageType(null)
                            .imageBytes(null)
                            .build(),
                    Product.builder()
                            .name("Smartphone")
                            .supplier("Samsung")
                            .price(new BigDecimal("899.99"))
                            .imageName(null).imageType(null).imageBytes(null).build(),
                    Product.builder()
                            .name("Headphones")
                            .supplier("Sony")
                            .price(new BigDecimal("199.50"))
                            .imageName(null).imageType(null).imageBytes(null).build(),
                    Product.builder()
                            .name("Monitor")
                            .supplier("LG")
                            .price(new BigDecimal("350.75"))
                            .imageName(null).imageType(null).imageBytes(null).build(),
                    Product.builder()
                            .name("Keyboard")
                            .supplier("Logitech")
                            .price(new BigDecimal("75.00"))
                            .imageName(null).imageType(null).imageBytes(null).build()
            );

            productRepository.saveAll(products);
            Order order1 = new Order(null, LocalDateTime.now().minusDays(3), "Istanbul", "Shipped", customer, products.get(0));
            Order order2 = new Order(null, LocalDateTime.now().minusDays(1), "Ankara", "Processing", customer, products.get(1));
            Order order3 = new Order(null, LocalDateTime.now(), "Izmir", "Delivered", customer, products.get(2));

            orderRepository.saveAll(List.of(order1, order2, order3));

        }
    }
}