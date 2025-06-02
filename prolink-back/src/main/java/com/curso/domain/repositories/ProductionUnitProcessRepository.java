package com.curso.domain.repositories;

import com.curso.domain.model.ProductionUnitProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductionUnitProcessRepository extends JpaRepository<ProductionUnitProcess, Long> {
}
