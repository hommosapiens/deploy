package com.curso.controllers;

import com.curso.domain.model.ProcessTemplate;
import com.curso.services.ProcessTemplateService;
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
@RequestMapping("/process")
@Slf4j
@EnableMethodSecurity(prePostEnabled = true)
public class ProcessTemplateController {

    private final ProcessTemplateService processTemplateService;
    private final SimpMessagingTemplate messagingTemplate;


    @Autowired
    public ProcessTemplateController(ProcessTemplateService processTemplateService, SimpMessagingTemplate messagingTemplate) {
        this.processTemplateService = processTemplateService;
        this.messagingTemplate = messagingTemplate;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    @GetMapping("/all")
    public ResponseEntity<List<ProcessTemplate>> findAll() {

        List<ProcessTemplate> processTemplates = this.processTemplateService.findAll();

        if (processTemplates.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(processTemplates);
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    @GetMapping("/{id}")
    public ResponseEntity<ProcessTemplate> findById(@PathVariable("id") Long id) {
        log.info("\n--------------- Find ID Product Process ----------------");

        return this.processTemplateService
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/save")
    public ResponseEntity<ProcessTemplate> save(@RequestBody ProcessTemplate processTemplate) {
        log.info("Save Product Process: {}", processTemplate.toString());

        processTemplate = processTemplateService.save(processTemplate);
        messagingTemplate.convertAndSend("/topic/process", processTemplate);

        log.info("Successfully saved: {}", processTemplate.toString());

        if (processTemplate == null) {
            return ResponseEntity.unprocessableEntity().build();
        } else {
            return ResponseEntity.status(HttpStatus.CREATED).body(processTemplate);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<ProcessTemplate> update(@RequestBody ProcessTemplate processTemplate) {
        log.info("Update Process: {}", processTemplate.toString());

        processTemplate = processTemplateService.update(processTemplate);
        messagingTemplate.convertAndSend("/topic/process", processTemplate);

        log.info("Successfully updated: {}", processTemplate.toString());

        return ResponseEntity.ok(processTemplate);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ProcessTemplate> delete(@PathVariable Long id) {
        log.info("Delete Process: {}", id.toString());

        processTemplateService.deleteById(id);
        messagingTemplate.convertAndSend("/topic/process-deleted", id);

        log.info("Successfully deleted: {}", id);

        return ResponseEntity.ok().build();
    }
}