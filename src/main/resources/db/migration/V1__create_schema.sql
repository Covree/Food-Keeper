CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE categories (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_categories_name (name)
) ENGINE=InnoDB;

CREATE TABLE products (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    unit_of_measure VARCHAR(10) NOT NULL,
    storage_sector VARCHAR(20) NOT NULL,
    barcode VARCHAR(80),
    active BOOLEAN NOT NULL,
    PRIMARY KEY (id),
    KEY idx_products_name (name),
    KEY idx_products_barcode (barcode)
) ENGINE=InnoDB;

CREATE TABLE product_categories (
    product_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    CONSTRAINT fk_pc_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE batches (
    id BIGINT NOT NULL AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    quantity DECIMAL(14,3) NOT NULL,
    expiration_date DATE NOT NULL,
    entry_date DATE NOT NULL,
    active BOOLEAN NOT NULL,
    PRIMARY KEY (id),
    KEY idx_batches_expiration (expiration_date),
    KEY idx_batches_product (product_id),
    CONSTRAINT fk_batches_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

CREATE TABLE movements (
    id BIGINT NOT NULL AUTO_INCREMENT,
    batch_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL,
    quantity DECIMAL(14,3) NOT NULL,
    reason VARCHAR(255),
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    KEY idx_movements_batch (batch_id),
    KEY idx_movements_created (created_at),
    CONSTRAINT fk_movements_batch FOREIGN KEY (batch_id) REFERENCES batches(id),
    CONSTRAINT fk_movements_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE alerts (
    id BIGINT NOT NULL AUTO_INCREMENT,
    batch_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL,
    message VARCHAR(255) NOT NULL,
    read_flag BOOLEAN NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    KEY idx_alerts_batch (batch_id),
    KEY idx_alerts_read (read_flag),
    CONSTRAINT fk_alerts_batch FOREIGN KEY (batch_id) REFERENCES batches(id)
) ENGINE=InnoDB;
