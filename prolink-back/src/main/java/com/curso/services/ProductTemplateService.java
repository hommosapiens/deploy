package com.curso.services;


import com.curso.domain.model.ProductTemplate;
import com.curso.dto.ProductTemplateDTO;

import java.util.List;
import java.util.Optional;

public interface ProductTemplateService {

    ProductTemplate save(ProductTemplate productTemplate);

    List<ProductTemplate> saveAll(List<ProductTemplateDTO> productsDTO);

    List<ProductTemplate> findAll();

    Optional<ProductTemplate> findById(Long id);

    ProductTemplate update(ProductTemplate productTemplate);

    Boolean deleteById(Long id);
}
