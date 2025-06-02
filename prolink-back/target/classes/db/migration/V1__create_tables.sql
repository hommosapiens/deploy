-- Templates
CREATE TABLE state_templates
(
    id          bigint       NOT NULL AUTO_INCREMENT,
    description varchar(255) NOT NULL,
    status      enum('DELAYED','DONE','IN_PROGRESS','NONE')  DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY u_states01 (description)
);

CREATE TABLE process_templates
(
    id          bigint NOT NULL AUTO_INCREMENT,
    description varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE process_state_templates
(
    process_id bigint NOT NULL,
    state_id   bigint NOT NULL,
    KEY        fk_processes_states02 (state_id),
    KEY        fk_processes_states01 (process_id),
    CONSTRAINT fk_processes_states01 FOREIGN KEY (process_id) REFERENCES process_templates (id),
    CONSTRAINT fk_processes_states02 FOREIGN KEY (state_id) REFERENCES state_templates (id)
);

CREATE TABLE product_templates
(
    id          bigint NOT NULL,
    process_id  bigint       DEFAULT NULL,
    description varchar(255) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY         fk_products01 (process_id),
    CONSTRAINT fk_products01 FOREIGN KEY (process_id) REFERENCES process_templates (id)
);

-- Production
CREATE TABLE sales
(
    end_date  date,
    init_date date,
    id        bigint NOT NULL AUTO_INCREMENT,
    client    varchar(255),
    code      varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE production_unit_processes
(
    id          bigint NOT NULL AUTO_INCREMENT,
    description varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE production_unit_states
(
    id                    bigint       NOT NULL AUTO_INCREMENT,
    production_process_id bigint,
    description           varchar(255) NOT NULL,
    status                enum('DELAYED','DONE','IN_PROGRESS','NONE'),
    PRIMARY KEY (id),
    KEY                   fk_production_unit_states01 (production_process_id),
    CONSTRAINT fk_production_unit_states01 FOREIGN KEY (production_process_id) REFERENCES production_unit_processes (id) ON DELETE CASCADE
);

CREATE TABLE production_units
(
    id          bigint NOT NULL AUTO_INCREMENT,
    process_id  bigint,
    sale_id     bigint,
    carriage    varchar(255),
    description varchar(255),
    PRIMARY KEY (id),
    UNIQUE KEY u_production_units01 (process_id),
    KEY         fk_production_units01 (sale_id),
    CONSTRAINT fk_production_units01 FOREIGN KEY (sale_id) REFERENCES sales (id) ON DELETE CASCADE,
    CONSTRAINT fk_production_units FOREIGN KEY (process_id) REFERENCES production_unit_processes (id) ON DELETE CASCADE
);

-- Users
CREATE TABLE users (
                       id BIGINT NOT NULL AUTO_INCREMENT,
                       username VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role ENUM('ADMIN', 'SUPERVISOR', 'USER') NOT NULL,
                       PRIMARY KEY (id)
);
