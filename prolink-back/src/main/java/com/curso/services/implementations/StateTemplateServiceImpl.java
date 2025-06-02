package com.curso.services.implementations;

import com.curso.domain.model.StateTemplate;
import com.curso.domain.repositories.StateTemplateRepository;
import com.curso.services.StateTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StateTemplateServiceImpl implements StateTemplateService {

    private final StateTemplateRepository stateTemplateRepository;

    @Autowired
    public StateTemplateServiceImpl(StateTemplateRepository stateTemplateRepository) {
        this.stateTemplateRepository = stateTemplateRepository;
    }

    @Override
    public List<StateTemplate> findAll() {
        return stateTemplateRepository.findAll();
    }

    @Override
    public StateTemplate findById(Long id) {
        return stateTemplateRepository.findById(id).orElseThrow(() -> new RuntimeException("No production state found with id: " + id));
    }

    @Override
    public StateTemplate save(StateTemplate stateTemplate) {
        return stateTemplateRepository.save(stateTemplate);
    }

    @Override
    public StateTemplate update(StateTemplate update) {

        StateTemplate entity = stateTemplateRepository.findById(update.getId()).orElseThrow(() -> new RuntimeException("No production state found with id: " + update.getId()));

        if (update.getDescription() != null) {
            entity.setDescription(update.getDescription());
        }
        if (update.getStatus() != null) {
            entity.setStatus(update.getStatus());
        }

        save(entity);

        return entity;
    }

    @Transactional
    @Override
    public void deleteById(Long id) {
        stateTemplateRepository.deleteById(id);
    }
}
