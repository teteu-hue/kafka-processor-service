CREATE TABLE uappi_orders (
    order_id VARCHAR(255) NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    gross_value DOUBLE NOT NULL,
    redeemed_bonus DOUBLE NOT NULL,
    bonus_ids TEXT,
    ticket VARCHAR(50),
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    order_status INT NOT NULL,
    order_status_description VARCHAR(255),
    status_order_process ENUM('waiting', 'pending', 'processed', 'failed') DEFAULT 'waiting',
    modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id)
);

INSERT INTO uappi_orders(
    order_id,
    store_name,
    gross_value,
    redeemed_bonus,
    bonus_ids,
    ticket,
    user_id,
    store_id,
    order_status,
    order_status_description
)
VALUES(
    '1234567890',
    'Ellus',
    100.50,
    10.00,
    "15468447,15468448,15468449",
    "CRM-TICKET-1",
    1598,
    1978,
    3,
    "Pago"
);
