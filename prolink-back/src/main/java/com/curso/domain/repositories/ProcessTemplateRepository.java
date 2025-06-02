package com.curso.domain.repositories;

import com.curso.domain.model.ProcessTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProcessTemplateRepository extends JpaRepository<ProcessTemplate, Long> {
    Optional<ProcessTemplate> findByDescription(String description);
}
