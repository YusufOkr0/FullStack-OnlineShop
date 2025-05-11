package com.swe212.onlineshop.service;

import com.swe212.onlineshop.dtos.ProductDto;
import com.swe212.onlineshop.dtos.request.AddProductRequest;
import com.swe212.onlineshop.dtos.request.UpdateProductRequest;
import com.swe212.onlineshop.entity.Product;
import com.swe212.onlineshop.exception.ProductNotFoundException;
import com.swe212.onlineshop.exception.TakenProductNameException;
import com.swe212.onlineshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
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
public class ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> modelMapper.map(product, ProductDto.class))
                .toList();
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ürün bulunamadı: " + id));
        return modelMapper.map(product, ProductDto.class);
    }

    public String deleteProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ürün bulunamadı: " + id));
        productRepository.delete(product);
        return String.format("Product with the id %s has been deleted successfully.", id);
    }

    public String addProduct(AddProductRequest addProductRequest, MultipartFile file) {
        boolean isProductExists = productRepository.existsByName(addProductRequest.getName());
        if (isProductExists) {
            throw new TakenProductNameException(String.format("Product with the name: %s already exists.", addProductRequest.getName()));
        }

        String filename = null;
        if (file != null && !file.isEmpty()) {
            filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String uploadDir = "src/main/resources/static/products/" + filename;
            Path uploadPath = Paths.get(uploadDir);

            try {
                // Eğer dizin yoksa oluştur
                if (!Files.exists(uploadPath.getParent())) {
                    Files.createDirectories(uploadPath.getParent());
                }

                // Dosyayı kaydet
                Files.copy(file.getInputStream(), uploadPath, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException ex) {
                throw new RuntimeException("Ürün görseli yüklenemedi: " + ex.getMessage());
            }
        }

        // Yeni ürün oluştur ve kaydet
        Product newProduct = Product.builder()
                .name(addProductRequest.getName())
                .supplier(addProductRequest.getSupplier())
                .price(addProductRequest.getPrice())
                .imageUrl("/products/" + filename)
                .build();

        productRepository.save(newProduct);

        return String.format("Product with the name: %s has been added successfully.", addProductRequest.getName());
    }

    public String updateProductById(Long productId, UpdateProductRequest updateProductRequest, MultipartFile file) {
        Product productToUpdate = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(String.format("Product with the id: %d not found.", productId)));

        if (!productToUpdate.getName().equals(updateProductRequest.getName())) {
            if (productRepository.existsByName(updateProductRequest.getName())) {
                throw new TakenProductNameException(String.format("Product with the name: %s already exists.", updateProductRequest.getName()));
            }
            productToUpdate.setName(updateProductRequest.getName());
        }

        if (updateProductRequest.getName() != null){
            productToUpdate.setPrice(updateProductRequest.getPrice());
        }
        if (updateProductRequest.getSupplier() != null){
            productToUpdate.setSupplier(updateProductRequest.getSupplier());
        }


        if (file != null && !file.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String uploadDir = "src/main/resources/static/products/";
            Path uploadPath = Paths.get(uploadDir);
            Path filePath = uploadPath.resolve(filename);

            try {
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                productToUpdate.setImageUrl("/products/" + filename);

            } catch (IOException e) {
                throw new RuntimeException("Ürün görseli yüklenemedi: " + e.getMessage(), e);
            }
        }

        productRepository.save(productToUpdate);

        return String.format("Product with the name: %s has been updated successfully.", productToUpdate.getName());
    }


}
