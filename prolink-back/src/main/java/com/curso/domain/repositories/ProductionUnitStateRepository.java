package com.curso.domain.repositories;

import com.curso.domain.model.ProductionUnitState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductionUnitStateRepository extends JpaRepository<ProductionUnitState, Long> {
}
