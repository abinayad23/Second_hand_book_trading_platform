package edu.gct.campusLink.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class ImageStorageServiceImpl implements ImageStorageService {

    private final Path rootLocation = Paths.get("uploads");

    @Override
    public String storeImage(MultipartFile file, String folder) {
        try {
            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            Path destination = rootLocation.resolve(folder).resolve(filename);
            Files.createDirectories(destination.getParent());
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }
    }

    @Override
    public byte[] loadImage(String filename, String folder) {
        try {
            Path filePath = rootLocation.resolve(folder).resolve(filename);
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load image", e);
        }
    }
}