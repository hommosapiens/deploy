package com.curso.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "production_unit_processes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductionUnitProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @OneToMany(cascade = CascadeType.ALL,orphanRemoval = true)
    @JoinColumn(name = "production_process_id")
    private List<ProductionUnitState> states = new ArrayList<>();

}
