package com.curso.services.implementations;


import com.curso.domain.model.*;
import com.curso.domain.repositories.*;
import com.curso.dto.ProductTemplateDTO;
import com.curso.dto.SaleDTO;
import com.curso.services.SaleService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final ProcessTemplateRepository processTemplateRepository;
    private final ProductionUnitRepository productionUnitRepository;
    private final ProductionUnitProcessRepository productionUnitProcessRepository;
    private final ProductionUnitStateRepository productionUnitStateRepository;

    @Autowired
    public SaleServiceImpl(
            SaleRepository saleRepository, ProductRepository productRepository, ProductionUnitRepository productionUnitRepository,
            ProcessTemplateRepository processTemplateRepository,
            ProductionUnitProcessRepository productionUnitProcessRepository, ProductionUnitStateRepository productionUnitStateRepository) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.processTemplateRepository = processTemplateRepository;
        this.productionUnitRepository = productionUnitRepository;
        this.productionUnitProcessRepository = productionUnitProcessRepository;
        this.productionUnitStateRepository = productionUnitStateRepository;
    }

    @Override
    public Sale save(SaleDTO saleDTO) {

        if (saleRepository.existsByCode(saleDTO.getCode())) {
            throw new RuntimeException("La venta " + saleDTO.getCode() + " ya existe.");
        }

        //Creamos la venta sin los productos
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        Sale sale = Sale.builder()
                .id(null)
                .code(saleDTO.getCode())
                .initDate(LocalDate.parse(saleDTO.getInitDate(), formatter))
                .endDate(LocalDate.parse(saleDTO.getEndDate(), formatter))
                .client(saleDTO.getClient())
                .build();

        //Preparamos los productos de la venta
        List<ProductionUnit> productionUnits = new ArrayList<>();

        //Transformamos un ProductTemplate en PorductionUnit para representar en productio en fabrica
        saleDTO.getProducts().forEach(productDTO -> {

            //Cargamos la cantidad del producto que se va a fabricar
            double amount = Double.parseDouble(productDTO.getAmount().replace(",", "."));

            for (double i = 0; i < amount; i++) {
                productionUnits.add(ProductTemplateToProductionUnit(productDTO));
            }

        });

        sale.setProductionUnits(productionUnits);

        return this.saleRepository.save(sale);
    }

    @Override
    public List<Sale> findAll() {
        return this.saleRepository.findAll();
    }

    @Override
    public Optional<Sale> findById(String id) {
        return this.saleRepository.findById(id);
    }

    @Override
    public Sale update(Sale sale) {

        if (!saleRepository.existsByCode(sale.getCode())) {
            throw new RuntimeException("No sale found with code: " + sale.getCode());
        }

        sale.setProductionUnits(sale.getProductionUnits().stream().map(productionUnit -> {
            ProductionUnitProcess process = productionUnit.getProcess();

            process.setStates(process.getStates().stream().map(productionUnitStateRepository::save).toList());

            process = productionUnitProcessRepository.save(process);

            productionUnit.setProcess(process);

            return productionUnitRepository.save(productionUnit);

        }).toList());

        return saleRepository.save(sale);
    }


    @Override
    @Transactional
    public void deleteById(String id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No sale found with id: " + id));

        for (ProductionUnit productionUnit : sale.getProductionUnits()) {
            ProductionUnitProcess process = productionUnit.getProcess();

            if (process != null) {
                productionUnitProcessRepository.delete(process);
            }

            productionUnitRepository.delete(productionUnit);
        }

        saleRepository.delete(sale);
    }


    @Override
    public ProductionUnit ProductTemplateToProductionUnit(ProductTemplateDTO productDTO) {
        ProductTemplate productTemplate;

        ProductionUnit productionUnit;
        ProductionUnitProcess productionUnitProcess;
        List<ProductionUnitState> productionUnitStates;

        //Cargamos el id del producto
        Long id = Long.parseLong(productDTO.getId());

        //Obtenemos la plantilla del producto o si no existe lo creamos (esto dinamiza la carga del pedido)
        productTemplate = productRepository.findById(id).orElseGet(() -> productRepository.save(ProductTemplate.builder()
                .id(id)
                .description(productDTO.getDescription())
                .process(processTemplateRepository.findById(1L).orElseThrow(() -> new RuntimeException("No process template found with id: 1")))
                .build()));

        //Duplicamos los estados a usar en la unidad de producción
        productionUnitStates = productTemplate
                .getProcess()
                .getStates()
                .stream()
                .map(stateTemplate ->
                        productionUnitStateRepository.save(ProductionUnitState.builder()
                                .id(null)
                                .description(stateTemplate.getDescription())
                                .status(stateTemplate.getStatus())
                                .build())
                ).toList();

        //Duplicamos el proceso para usar en la unidad de producción
        productionUnitProcess = productionUnitProcessRepository.save(ProductionUnitProcess.builder()
                .id(null)
                .description(productTemplate.getProcess().getDescription())
                .states(productionUnitStates)
                .build());

        //Por último creamos nuetro producto como unidad de producción y la devolvemos
        productionUnit = ProductionUnit.builder()
                .id(null)
                .carriage("NA")
                .description(productTemplate.getDescription())
                .process(productionUnitProcess)
                .build();

        return productionUnitRepository.save(productionUnit);
    }
}
