package com.curso.controllers;

import com.curso.domain.model.ProductTemplate;
import com.curso.dto.ProductTemplateDTO;
import com.curso.services.ProductTemplateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@Slf4j
@EnableMethodSecurity(prePostEnabled = true)
public class ProductTemplateController {

    private final ProductTemplateService productTemplateService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ProductTemplateController(ProductTemplateService productTemplateService, SimpMessagingTemplate messagingTemplate) {
        this.productTemplateService = productTemplateService;
        this.messagingTemplate = messagingTemplate;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    @GetMapping("/all")
    public ResponseEntity<List<ProductTemplate>> findAll() {
        log.info("\n--------------- Find All Products ---------------");

        List<ProductTemplate> productTemplates = productTemplateService.findAll();

        if (productTemplates.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(productTemplates);
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    @GetMapping("/{id}")
    public ResponseEntity<ProductTemplate> findById(@PathVariable Long id) {
        log.info("--------------- Find ID Product ---------------");

        return productTemplateService
                .findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/save")
    public ResponseEntity<ProductTemplate> save(@RequestBody ProductTemplate productTemplate) {
        log.info("Save Product: {}", productTemplate.toString());

        productTemplate = productTemplateService.save(productTemplate);
        messagingTemplate.convertAndSend("/topic/product", productTemplate);

        log.info("Successfully saved: {}", productTemplate.toString());

        if (productTemplate == null) {
            return ResponseEntity.badRequest().build();
        } else {
            return ResponseEntity.status(HttpStatus.CREATED).body(productTemplate);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/saveAll")
    public ResponseEntity<List<ProductTemplate>> saveAll(@RequestBody List<ProductTemplateDTO> productsDTO) {
        log.info("Save all Products: {}", productsDTO.toString());

        List<ProductTemplate> productTemplates = null;

        productTemplates = productTemplateService.saveAll(productsDTO);
        messagingTemplate.convertAndSend("/topic/product", productTemplates);

        log.info("Successfully saved: {}", productTemplates.toString());

        if (productTemplates == null) {
            return ResponseEntity.badRequest().build();
        } else {
            return ResponseEntity.status(HttpStatus.CREATED).body(productTemplates);
        }
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<ProductTemplate> update(@RequestBody ProductTemplate productTemplateUpdate) {
        log.info("Update Product: {}", productTemplateUpdate.toString());

        ProductTemplate productTemplate = productTemplateService.update(productTemplateUpdate);
        messagingTemplate.convertAndSend("/topic/product", productTemplate);

        log.info("Successfully updated: {}", productTemplateUpdate.toString());

        return ResponseEntity.ok(productTemplate);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        log.info("Delete Product: {}", id.toString());

        productTemplateService.deleteById(id);
        messagingTemplate.convertAndSend("/topic/product-deleted", id);

        log.info("Successfully deleted: {}", id);

        return ResponseEntity.ok().build();

    }
}
