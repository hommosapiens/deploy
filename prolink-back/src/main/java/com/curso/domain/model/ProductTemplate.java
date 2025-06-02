package com.curso.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductTemplate {

    @Id
    private Long id;

    private String description;

    @ManyToOne
    @JoinColumn(name = "process_id")
    private ProcessTemplate process;
}
