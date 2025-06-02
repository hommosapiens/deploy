package com.curso.domain.repositories;

import com.curso.domain.model.StateTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateTemplateRepository extends JpaRepository<StateTemplate, Long> {}
