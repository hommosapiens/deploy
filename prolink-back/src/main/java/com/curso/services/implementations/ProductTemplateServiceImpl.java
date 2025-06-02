package com.curso.services.implementations;


import com.curso.domain.model.ProcessTemplate;
import com.curso.domain.model.ProductTemplate;
import com.curso.domain.repositories.ProcessTemplateRepository;
import com.curso.domain.repositories.ProductRepository;
import com.curso.dto.ProductTemplateDTO;
import com.curso.services.ProductTemplateService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductTemplateServiceImpl implements ProductTemplateService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper = new ModelMapper();
    private final ProcessTemplateRepository processTemplateRepository;

    @Autowired
    public ProductTemplateServiceImpl(ProductRepository productRepository, ProcessTemplateRepository processTemplateRepository) {
        this.productRepository = productRepository;
        this.processTemplateRepository = processTemplateRepository;
    }

    @Override
    public ProductTemplate
    save(ProductTemplate productTemplate) {
        return this.productRepository.save(productTemplate);
    }

    @Override
    public List<ProductTemplate> saveAll(List<ProductTemplateDTO> productsDTO) {
        List<ProductTemplate> productTemplates = productsDTO
                .stream()
                .map(p -> {
                    System.out.println(p);
                    //Map DTO to entity
                    ProductTemplate productTemplate = modelMapper.map(p, ProductTemplate.class);

                    //If id is set, we use it
                    if (p.getId() != null) {
                        Long id = Long.parseLong(p.getId());
                        productTemplate.setId(id);
                    }

                    //If a process is set, we use it
                    if (p.getProcessName() != null) {
                        Optional<ProcessTemplate> process = processTemplateRepository.findByDescription(p.getProcessName());

                        if (process.isPresent()) {
                            productTemplate.setProcess(process.get());
                        } else {
                            productTemplate.setProcess(processTemplateRepository.findById(1L).get());
                        }
                    }

                    return productTemplate;

                }).toList();

        return this.productRepository.saveAll(productTemplates);
    }

    @Override
    public List<ProductTemplate> findAll() {
        return this.productRepository.findAll();
    }

    @Override
    public Optional<ProductTemplate> findById(Long id) {
        return this.productRepository.findById(id);
    }

    @Override
    public ProductTemplate update(ProductTemplate productTemplateUpdate) {

        ProductTemplate productTemplate = this.productRepository.findById(productTemplateUpdate.getId()).orElseThrow(() -> new RuntimeException("No product found with id: " + productTemplateUpdate.getId()));

        if (productTemplateUpdate.getDescription() != null) {
            productTemplate.setDescription(productTemplateUpdate.getDescription());
        }

        if (productTemplateUpdate.getProcess() != null) {
            productTemplate.setProcess(productTemplateUpdate.getProcess());
        }

        return this.productRepository.save(productTemplate);
    }

    @Override
    public Boolean deleteById(Long id) {

        Optional<ProductTemplate> oProduct = this.productRepository.findById(id);

        if (oProduct.isEmpty()) return Boolean.FALSE;
        else {

            this.productRepository.delete(oProduct.get());

            return Boolean.TRUE;
        }
    }
}
