package com.curso.domain.repositories;

import com.curso.domain.model.ProductTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<ProductTemplate, Long> {}
