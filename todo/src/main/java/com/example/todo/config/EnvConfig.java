package com.example.todo.config;

import org.springframework.context.annotation.Configuration;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Configuration class to load environment variables from .env file
 * This class is executed when the Spring application starts
 * 
 * The .env file format is: KEY=VALUE (one per line)
 * Comments starting with # are ignored
 */
@Configuration
public class EnvConfig {

    public EnvConfig() {
        loadEnvFile();
    }

    private void loadEnvFile() {
        try {
            // Try to load .env from current directory and parent directories
            String[] possiblePaths = {".env", "./target/../.env"};
            
            for (String path : possiblePaths) {
                try {
                    Files.lines(Paths.get(path))
                            .filter(line -> !line.isEmpty() && !line.startsWith("#"))
                            .forEach(this::setEnvironmentVariable);
                    System.out.println("✓ Successfully loaded .env file from: " + path);
                    return;
                } catch (IOException e) {
                    // Try next path
                }
            }
            
            System.out.println("⚠ Warning: .env file not found. Using system environment variables.");
            
        } catch (Exception e) {
            System.out.println("⚠ Warning: Error loading .env file: " + e.getMessage());
        }
    }

    private void setEnvironmentVariable(String line) {
        String[] parts = line.split("=", 2);
        if (parts.length == 2) {
            String key = parts[0].trim();
            String value = parts[1].trim();
            
            // Remove quotes if present
            if (value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length() - 1);
            }
            if (value.startsWith("'") && value.endsWith("'")) {
                value = value.substring(1, value.length() - 1);
            }
            
            System.setProperty(key, value);
        }
    }
}

