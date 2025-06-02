package com.curso.domain.repositories;

import com.curso.domain.model.ProductionUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductionUnitRepository extends JpaRepository<ProductionUnit, Long> {
}
