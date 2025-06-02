package com.curso.services;


import com.curso.domain.model.ProcessTemplate;

import java.util.List;
import java.util.Optional;

public interface ProcessTemplateService {

    ProcessTemplate save(ProcessTemplate processTemplate);

    List<ProcessTemplate> findAll();

    Optional<ProcessTemplate> findById(Long id);

    ProcessTemplate update(ProcessTemplate processTemplate);

    void deleteById(Long id);
}
