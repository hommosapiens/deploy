package com.curso.configurations;

import com.curso.domain.model.User;
import com.curso.domain.model.enums.Role;
import com.curso.domain.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }
            if (userRepository.findByUsername("supervisor").isEmpty()) {
                User supervisor = new User();
                supervisor.setUsername("supervisor");
                supervisor.setPassword(passwordEncoder.encode("supervisor"));
                supervisor.setRole(Role.SUPERVISOR);
                userRepository.save(supervisor);
            }
            if (userRepository.findByUsername("user").isEmpty()) {
                User user = new User();
                user.setUsername("user");
                user.setPassword(passwordEncoder.encode("user"));
                user.setRole(Role.USER);
                userRepository.save(user);
            }
        };
    }
}

