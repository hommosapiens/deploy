package com.curso.controllers;

import com.curso.domain.model.Sale;
import com.curso.dto.SaleDTO;
import com.curso.services.SaleService;
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
@RequestMapping("/sale")
@Slf4j
@EnableMethodSecurity(prePostEnabled = true)
public class SaleController {
    private final SaleService saleService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public SaleController(SaleService saleService, SimpMessagingTemplate messagingTemplate) {
        this.saleService = saleService;
        this.messagingTemplate = messagingTemplate;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USER')")
    @GetMapping("/all")
    public ResponseEntity<List<Sale>> getAllSales() {

        log.info("Init find all sales");

        try {
            List<Sale> sales = saleService.findAll();
            return ResponseEntity.ok(sales);
        } catch (Exception e) {
            log.error("Error al obtener ventas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<Sale> findById(@PathVariable String id) {
        log.info("Init find ID sale by Id: {}", id);
        return saleService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    @PostMapping("/save")
    public ResponseEntity<Sale> save(@RequestBody SaleDTO saleDTO) {

        log.info("Inti save Sale: {}", saleDTO.toString());

        Sale sale = saleService.save(saleDTO);
        messagingTemplate.convertAndSend("/topic/sale", sale);

        return ResponseEntity.status(HttpStatus.CREATED).body(sale);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USER')")
    @PutMapping("/update")
    public ResponseEntity<Sale> update(@RequestBody Sale saleUpdate) {
        log.info("Update Sale: {}", saleUpdate.toString());

        Sale sale = saleService.update(saleUpdate);
        messagingTemplate.convertAndSend("/topic/sale", sale);

        log.info("Successfully updated: {}", saleUpdate.toString());

        return ResponseEntity.ok(sale);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Sale> delete(@PathVariable String id) {
        log.info("Delete Sale: {}", id);

        saleService.deleteById(id);
        messagingTemplate.convertAndSend("/topic/sale-deleted", id);

        log.info("Successfully deleted: {}", id);
        return ResponseEntity.ok().build();
    }
}
