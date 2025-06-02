package com.curso.services;


import com.curso.domain.model.ProductTemplate;
import com.curso.domain.model.ProductionUnit;
import com.curso.domain.model.Sale;
import com.curso.dto.ProductTemplateDTO;
import com.curso.dto.SaleDTO;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

public interface SaleService {

    Sale save(SaleDTO saleDTO);

    List<Sale> findAll();

    Optional<Sale> findById(String id);

    Sale update(Sale sale);

    void deleteById(String id);

    ProductionUnit ProductTemplateToProductionUnit(ProductTemplateDTO productDTO);
}
