package com.curso.services;


import com.curso.domain.model.StateTemplate;

import java.util.List;

public interface StateTemplateService {

    List<StateTemplate> findAll();

    StateTemplate findById(Long id);

    StateTemplate save(StateTemplate stateTemplate);

    StateTemplate update(StateTemplate update);

    void deleteById(Long id);
}
