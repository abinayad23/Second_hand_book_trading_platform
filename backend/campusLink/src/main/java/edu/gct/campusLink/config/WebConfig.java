package edu.gct.campusLink.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String uploadPath = "D:/Project/Second_hand_book_trading_platform/uploads";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Convert path to URI so Spring can serve it correctly
        String absolutePath = Paths.get(uploadPath).toAbsolutePath().toUri().toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(absolutePath);
    }
}
