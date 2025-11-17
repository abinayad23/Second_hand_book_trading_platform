package edu.gct.campusLink.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper objectMapper = builder.build();
        SimpleModule module = new SimpleModule();
        
        // Custom LocalDate deserializer that handles multiple formats
        module.addDeserializer(LocalDate.class, new JsonDeserializer<LocalDate>() {
            private final DateTimeFormatter[] formatters = {
                DateTimeFormatter.ofPattern("dd-MM-yyyy"),  // DD-MM-YYYY
                DateTimeFormatter.ofPattern("yyyy-MM-dd"),   // ISO format
                DateTimeFormatter.ofPattern("dd/MM/yyyy"),  // DD/MM/YYYY
                DateTimeFormatter.ISO_LOCAL_DATE            // Default ISO
            };

            @Override
            public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
                String dateString = p.getText();
                
                if (dateString == null || dateString.trim().isEmpty() || "null".equals(dateString)) {
                    return null;
                }

                // Try each format
                for (DateTimeFormatter formatter : formatters) {
                    try {
                        return LocalDate.parse(dateString, formatter);
                    } catch (DateTimeParseException e) {
                        // Try next format
                    }
                }

                // If all formats fail, throw exception
                throw new IOException("Cannot parse date: " + dateString + 
                    ". Supported formats: dd-MM-yyyy, yyyy-MM-dd, dd/MM/yyyy");
            }
        });

        objectMapper.registerModule(module);
        return objectMapper;
    }
}

