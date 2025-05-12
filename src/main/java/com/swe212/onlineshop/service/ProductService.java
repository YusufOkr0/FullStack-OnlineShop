package com.swe212.onlineshop.service;

import com.swe212.onlineshop.dtos.ProductDto;
import com.swe212.onlineshop.dtos.request.AddProductRequest;
import com.swe212.onlineshop.dtos.request.UpdateProductRequest;
import com.swe212.onlineshop.entity.Product;
import com.swe212.onlineshop.exception.*;
import com.swe212.onlineshop.repository.ProductRepository;
import com.swe212.onlineshop.util.ImageLoader;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ProductService {

    public static final String PHOTO_URL = "static/no-user-photo.png";

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> {
                    ProductDto productDto = modelMapper.map(product, ProductDto.class);
                    if (product.getImageBytes() != null)
                        productDto.setHasImage(true);
                    return productDto;
                })
                .toList();
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(String.format("Product with the id: %d not found.", id)));

        ProductDto productDto = modelMapper.map(product, ProductDto.class);
        if (product.getImageBytes() != null)
            productDto.setHasImage(true);

        return productDto;
    }

    public String deleteProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(String.format("Product with the id: %d not found.", id)));
        productRepository.delete(product);
        return String.format("Product with the id %s has been deleted successfully.", id);
    }

    public String addProduct(AddProductRequest addProductRequest, MultipartFile file) {
        String productName = addProductRequest.getName().trim();
        boolean isProductExists = productRepository.existsByName(productName);
        if (isProductExists) {
            throw new TakenProductNameException(String.format("Product with the name: %s already exists.", productName));
        }


        byte[] imageBytes;
        String imageName;
        String imageType;

        try {
            if (file != null && !file.isEmpty()) {
                imageBytes = file.getBytes();
                imageName = file.getOriginalFilename();
                imageType = file.getContentType();
            } else {
                ImageLoader.ImageData defaultImageData = ImageLoader.loadImageData(PHOTO_URL);
                imageBytes = defaultImageData.bytes;
                imageName = defaultImageData.name;
                imageType = defaultImageData.type;
            }
        } catch (IOException ex) {
            throw new ImageProcessException("Error processing image for product: " + ex.getMessage());
        }

        Product newProduct = Product.builder()
                .name(productName)
                .supplier(addProductRequest.getSupplier().trim())
                .price(addProductRequest.getPrice())
                .imageName(imageName)
                .imageType(imageType)
                .imageBytes(imageBytes)
                .build();

        productRepository.save(newProduct);

        return String.format("Product with the name: %s has been added successfully.", productName);
    }

    public String updateProductById(Long productId, UpdateProductRequest updateProductRequest, MultipartFile file) {
        Product productToUpdate = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(String.format("Product with the id: %d not found.", productId)));

        if (updateProductRequest != null) {
            String newName = updateProductRequest.getName();
            if (newName != null && !newName.trim().isEmpty()) {
                if (!productToUpdate.getName().equals(newName)) {
                    if (productRepository.existsByName(newName.trim())) {
                        throw new TakenProductNameException(String.format("Product with the name: %s already exists.", newName.trim()));
                    }
                    productToUpdate.setName(newName.trim());
                }
            }

            if (updateProductRequest.getPrice() != null) {
                if (updateProductRequest.getPrice().compareTo(BigDecimal.ZERO) >= 0) {
                    productToUpdate.setPrice(updateProductRequest.getPrice());
                } else {
                    throw new InvalidPriceException("Price cannot be negative.");
                }
            }

            String newSupplier = updateProductRequest.getSupplier();
            if (newSupplier != null && !newSupplier.trim().isEmpty()) {
                productToUpdate.setSupplier(newSupplier.trim());
            }

        }

        if (file != null && !file.isEmpty()) {
            try {
                byte[] imageBytes = file.getBytes();
                String originalFilename = file.getOriginalFilename();
                String contentType = file.getContentType();

                productToUpdate.setImageBytes(imageBytes);
                productToUpdate.setImageName(originalFilename);
                productToUpdate.setImageType(contentType);

            } catch (IOException e) {
                throw new ImageProcessException("Image Process Exception: " + e.getMessage());
            }
        }
        productRepository.save(productToUpdate);

        return String.format("Product with the name: %s has been updated successfully.", productToUpdate.getName());
    }

    public Product getProductForImageById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(String.format("Product with the id: %d not found.", id)));

        if (product.getImageBytes() == null || product.getImageName() == null || product.getImageType() == null) {
            throw new ImageNotFoundException(String.format("Product with the id: %d does not have an image.", id));
        }

        return product;
    }


}
