package com.swe212.onlineshop.util;

import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.IOException;

public class ImageLoader {

    public static class ImageData {
        public final byte[] bytes;
        public final String name;
        public final String type;

        public ImageData(byte[] bytes, String name, String type) {
            this.bytes = bytes;
            this.name = name;
            this.type = type;
        }
    }


    public static byte[] readImageBytes(String classpathPath) {
        ClassPathResource resource = new ClassPathResource(classpathPath);
        try {
            return resource.getInputStream().readAllBytes();
        } catch (IOException e) {
        throw new RuntimeException("Error reading image bytes from classpath: " + classpathPath);
        }
    }


    public static String detectMimeType(String fileName) {
        if (fileName.toLowerCase().endsWith(".png")) return "image/png";
        if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg")) return "image/jpeg";
        return "application/octet-stream";
    }


    public static ImageData loadImageData(String classpathPath) {
        byte[] bytes = readImageBytes(classpathPath);
        String fileName = new File(classpathPath).getName();
        String mimeType = detectMimeType(fileName);
        return new ImageData(
                bytes,
                fileName,
                mimeType
        );
    }
}