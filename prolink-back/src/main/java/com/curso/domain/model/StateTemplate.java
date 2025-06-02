package com.curso.domain.model;

import com.curso.domain.model.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "state_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StateTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;
}