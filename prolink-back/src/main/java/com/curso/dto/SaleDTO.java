package com.curso.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleDTO {

    private Long id;

    private String code;

    private String client;

    private String initDate;

    private String endDate;

    private List<ProductTemplateDTO> products = new ArrayList<>();
}
