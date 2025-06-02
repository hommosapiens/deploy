INSERT INTO state_templates (description, status)
VALUES ('Corte', 'NONE'),
       ('Carpintería', 'NONE'),
       ('Pantografo', 'NONE'),
       ('Lija fondo', 'NONE'),
       ('Cabina fondo', 'NONE'),
       ('Calibradora', 'NONE'),
       ('Lija blanco', 'NONE'),
       ('Cabina lacar', 'NONE'),
       ('Montaje', 'NONE'),
       ('Embalaje', 'NONE'),
       ('Reparto', 'NONE');

INSERT INTO process_templates (description)
VALUES ('Standar');

-- proceso 1 Standar
INSERT INTO process_state_templates (process_id, state_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (1, 4),
       (1, 5),
       (1, 6),
       (1, 7),
       (1, 8),
       (1, 9),
       (1, 10),
       (1, 11);

INSERT INTO product_templates (id, description, process_id)
VALUES (1, 'PANEL LIA 116 LACADO BLANCO 2030X825X5', 1),
       (2, 'PANEL LIA 230 LACADO BLANCO 2030X825X5', 1),
       (3, 'PANEL LIA 280 LACADO BLANCO 2030X825X5', 1);