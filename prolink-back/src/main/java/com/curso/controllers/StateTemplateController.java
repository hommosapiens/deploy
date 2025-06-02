package com.curso.controllers;

import com.curso.domain.model.StateTemplate;
import com.curso.services.StateTemplateService;
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
@RequestMapping("/state")
@Slf4j
@EnableMethodSecurity(prePostEnabled = true)
public class StateTemplateController {

    private final StateTemplateService stateTemplateService;
    private final SimpMessagingTemplate messagingTemplate;


    @Autowired
    public StateTemplateController(StateTemplateService productStateTemplateService, SimpMessagingTemplate messagingTemplate) {
        this.stateTemplateService = productStateTemplateService;
        this.messagingTemplate = messagingTemplate;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    @GetMapping("/all")
    public ResponseEntity<List<StateTemplate>> findAll() {
        log.info("Find All Product States");

        List<StateTemplate> stateTemplates = this.stateTemplateService.findAll();

        if (stateTemplates.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(stateTemplates);
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    @GetMapping("/{id}")
    public ResponseEntity<StateTemplate> findById(@PathVariable("id") Long id) {
        log.info("\n--------------- Find ID Product State---------------");

        StateTemplate stateTemplate = this.stateTemplateService.findById(id);

        log.info(stateTemplate.toString());

        return ResponseEntity.ok(this.stateTemplateService.findById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/save")
    public ResponseEntity<StateTemplate> save(@RequestBody StateTemplate stateTemplate) {
        log.info("Save Product State: {}", stateTemplate.toString());

        stateTemplate = this.stateTemplateService.save(stateTemplate);
        messagingTemplate.convertAndSend("/topic/states", stateTemplate);

        log.info("Successfully saved: {}", stateTemplate.toString());

        return ResponseEntity.status(HttpStatus.CREATED).body(stateTemplate);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<StateTemplate> updateProductionState(@RequestBody StateTemplate update) {
        log.info("Update State: {}", update.toString());

        update = stateTemplateService.update(update);
        messagingTemplate.convertAndSend("/topic/states", update);

        log.info("Successfully updated: {}", update.toString());

        return ResponseEntity.ok(update);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<StateTemplate> deleteProductionStateById(@PathVariable Long id) {
        log.info("Delete State: {}", id.toString());

        this.stateTemplateService.deleteById(id);
        messagingTemplate.convertAndSend("/topic/states-deleted", id);

        log.info("Successfully deleted: {}", id);

        return ResponseEntity.ok().build();

    }
}