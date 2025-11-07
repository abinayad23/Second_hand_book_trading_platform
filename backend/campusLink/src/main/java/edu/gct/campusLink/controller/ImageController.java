package edu.gct.campusLink.controller;

import edu.gct.campusLink.service.ImageStorageService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageStorageService imageStorageService;

    public ImageController(ImageStorageService imageStorageService) {
        this.imageStorageService = imageStorageService;
    }

    @PostMapping("/upload/{folder}")
    public String uploadImage(@RequestParam("file") MultipartFile file,
                              @PathVariable String folder) {
        return imageStorageService.storeImage(file, folder);
    }

    @GetMapping(value = "/view/{folder}/{filename}", produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] viewImage(@PathVariable String folder,
                            @PathVariable String filename) {
        return imageStorageService.loadImage(filename, folder);
    }
}