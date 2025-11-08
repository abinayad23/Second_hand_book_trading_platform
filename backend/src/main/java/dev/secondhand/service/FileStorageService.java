package dev.secondhand.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path uploadDir = Path.of("uploads");

    public FileStorageService() throws IOException {
        if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);
    }

    public String store(MultipartFile file) throws IOException {
        String ext = "";
        var original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
        }
        String name = UUID.randomUUID().toString() + ext;
        Path target = uploadDir.resolve(name);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        // Return a relative URL that a controller will serve
        return "/uploads/" + name;
    }
}