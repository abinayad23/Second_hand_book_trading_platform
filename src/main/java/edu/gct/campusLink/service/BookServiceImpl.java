package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.dao.BookRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.io.FilenameUtils;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository repo;

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    public BookServiceImpl(BookRepository repo) {
        this.repo = repo;
    }

    @Override
    public Book create(Book book, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String stored = storeFile(image);
            book.setImagePath(stored);
        }
        return repo.save(book);
    }

    @Override
    public Optional<Book> findById(Long id) {
        return repo.findById(id);
    }

    @Override
    public Book update(Book book) {
        return repo.save(book);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public List<Book> search(String q) {
        if (q == null || q.isBlank()) return repo.findByIsAvailableTrue();
        return repo.searchAvailable(q);
    }

    @Override
    public List<Book> listAvailable() {
        return repo.findByIsAvailableTrue();
    }

    private String storeFile(MultipartFile file) {
        try {
            Files.createDirectories(Paths.get(uploadDir));
            String ext = FilenameUtils.getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + (ext.isEmpty() ? "" : "." + ext);
            Path target = Paths.get(uploadDir).resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}