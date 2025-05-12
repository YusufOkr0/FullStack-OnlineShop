package com.swe212.onlineshop.service;

import com.swe212.onlineshop.entity.Order;
import com.swe212.onlineshop.exception.OrderNotFoundException;
import com.swe212.onlineshop.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;

    public byte[] generateReceiptByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(String.format("Order with the id: %s not found", orderId)));

        Map<String, Object> orderData = new HashMap<>();
        orderData.put("id", order.getId());
        orderData.put("date", order.getDate());
        orderData.put("city", order.getCity());
        orderData.put("status", order.getStatus().toString());
        orderData.put("customerName", order.getCustomer().getUsername());
        orderData.put("productName", order.getProduct().getName());
        orderData.put("totalPrice", order.getProduct().getPrice());

        try {
            ClassPathResource classPathResource = new ClassPathResource("/reports/order_receipt.jrxml");
            JasperReport jasperReport = JasperCompileManager.compileReport(classPathResource.getInputStream());

            JRBeanCollectionDataSource orderDataSource = new JRBeanCollectionDataSource(Collections.singletonList(orderData));

            Map<String, Object> parameters = new HashMap<>();
            ClassPathResource logoResource = new ClassPathResource("/images/logo.png");
            ClassPathResource barcodeResource = new ClassPathResource("/images/barcode.png");
            parameters.put("LOGO_IMAGE", logoResource.getInputStream());
            parameters.put("BARCODE_IMAGE", barcodeResource.getInputStream());

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, orderDataSource);
            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (JRException | IOException e) {
            throw new RuntimeException(e);
        }
    }


}
