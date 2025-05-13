package com.swe212.onlineshop;

import com.github.javafaker.Faker; // Faker kütüphanesini import et
import com.swe212.onlineshop.entity.*;
import com.swe212.onlineshop.repository.CustomerRepository;
import com.swe212.onlineshop.repository.OrderRepository;
import com.swe212.onlineshop.repository.ProductRepository;
import com.swe212.onlineshop.util.ImageLoader;
import com.swe212.onlineshop.util.ImageLoader.ImageData;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale; // Locale eklemek için
import java.util.Random; // Rastgele seçimler için

@SpringBootApplication
@RequiredArgsConstructor
@EnableScheduling
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

            Faker faker = new Faker(Locale.CANADA);
            Random random = new Random();

            String customerImagePath = "images/no-user-photo.png";
            ImageData customerImageData = ImageLoader.loadImageData(customerImagePath);

            String productImagePath = "images/no-photo-product.jpeg";
            ImageData productImageData = ImageLoader.loadImageData(productImagePath);


            List<Customer> customers = new ArrayList<>();
            List<String> adminNames = List.of("Murat","Yusuf","Serhat","Gökdeniz","Erdogan");

            adminNames.forEach(adminName -> {
                customers.add(Customer.builder()
                        .username(adminName)
                        .password(passwordEncoder.encode(adminName))
                        .phone(faker.phoneNumber().cellPhone())
                        .address(faker.address().fullAddress())
                        .role(Role.ADMIN)
                        .imageBytes(customerImageData.bytes)
                        .imageName(customerImageData.name)
                        .imageType(customerImageData.type)
                        .orders(new ArrayList<>())
                        .build());
            });



            int numberOfCustomers = 20;
            for (int i = 0; i < numberOfCustomers; i++) {
                customers.add(Customer.builder()
                        .username(faker.name().username())
                        .password(passwordEncoder.encode("customer"))
                        .phone(faker.phoneNumber().cellPhone())
                        .address(faker.address().fullAddress())
                        .role(Role.CUSTOMER)
                        .imageBytes(customerImageData.bytes)
                        .imageName(customerImageData.name)
                        .imageType(customerImageData.type)
                        .orders(new ArrayList<>())
                        .build());
            }


            List<Customer> savedCustomers = customerRepository.saveAll(customers);



            List<Product> products = new ArrayList<>();

            int numberOfProducts = 40;
            for (int i = 0; i < numberOfProducts; i++) {

                BigDecimal price = new BigDecimal(faker.commerce().price().replace(",", "."));
                products.add(Product.builder()
                        .name(faker.commerce().productName())
                        .supplier(faker.company().name())
                        .price(price)
                        .imageName(productImageData.name)
                        .imageType(productImageData.type)
                        .imageBytes(productImageData.bytes)
                        .build());
            }

            List<Product> savedProducts = productRepository.saveAll(products);



            List<Order> orders = new ArrayList<>();
            int numberOfOrders = 30;

            for (int i = 0; i < numberOfOrders; i++) {
                Customer randomCustomer = savedCustomers.get(random.nextInt(savedCustomers.size()));

                Product randomProduct = savedProducts.get(random.nextInt(savedProducts.size()));

                LocalDateTime randomDate = faker
                        .date()
                        .past(4, java.util.concurrent.TimeUnit.DAYS).toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDateTime();

                OrderStatus randomStatus = OrderStatus.SHIPPED;

                if(randomDate.isBefore(LocalDateTime.now().minusDays(2L)))
                    randomStatus = OrderStatus.DELIVERED;

                String orderAddress = randomCustomer.getAddress();
                orders.add(new Order(null, randomDate, orderAddress, randomStatus, randomCustomer, randomProduct));
            }

            orderRepository.saveAll(orders);
        }
    }
}