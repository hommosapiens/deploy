package com.curso.services.implementations;

import com.curso.domain.model.ProcessTemplate;
import com.curso.domain.repositories.ProcessTemplateRepository;
import com.curso.services.ProcessTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProcessTemplateServiceImpl implements ProcessTemplateService {

    private final ProcessTemplateRepository processTemplateRepository;

    @Autowired
    public ProcessTemplateServiceImpl(ProcessTemplateRepository processTemplateRepository) {
        this.processTemplateRepository = processTemplateRepository;
    }

    @Override
    public ProcessTemplate save(ProcessTemplate processTemplate) {
        return processTemplateRepository.save(processTemplate);
    }

    @Override
    public List<ProcessTemplate> findAll() {
        return processTemplateRepository.findAll();
    }

    @Override
    public Optional<ProcessTemplate> findById(Long id) {
        return processTemplateRepository.findById(id);
    }

    @Override
    public ProcessTemplate update(ProcessTemplate processTemplateUpdate) {

        Optional<ProcessTemplate> oProcess =
                processTemplateRepository.findById(processTemplateUpdate.getId());

        if (oProcess.isEmpty()) return null;
        else {
            if (processTemplateUpdate.getDescription() != null) {
                oProcess.get().setDescription(processTemplateUpdate.getDescription());
            }

            if (!processTemplateUpdate.getStates().isEmpty()) {
                oProcess.get().setStates(processTemplateUpdate.getStates());
            }

            return processTemplateRepository.save(oProcess.get());
        }
    }

    @Override
    public void deleteById(Long id) {
        Optional<ProcessTemplate> oProcess = processTemplateRepository.findById(id);

        oProcess.get().getStates().clear();

        processTemplateRepository.delete(oProcess.get());

    }
}
