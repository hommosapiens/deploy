package com.curso.domain.repositories;

import com.curso.domain.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleRepository extends JpaRepository<Sale, String> {
    boolean existsByCode(String code);
}
