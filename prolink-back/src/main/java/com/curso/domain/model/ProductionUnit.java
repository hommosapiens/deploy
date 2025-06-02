package com.curso.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "production_units")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductionUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String carriage;

    private String description;

    @OneToOne
    @JoinColumn(name = "process_id")
    private ProductionUnitProcess process;
}