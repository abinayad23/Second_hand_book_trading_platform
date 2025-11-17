package edu.gct.campusLink.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {
    String storeImage(MultipartFile file, String folder);
    byte[] loadImage(String filename, String folder);
}