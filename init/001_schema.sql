-- 初回起動時に自動で実行される
CREATE TABLE IF NOT EXISTS cars (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  model VARCHAR(64) NOT NULL,
  price INT NOT NULL,
  year  INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bids (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  car_id BIGINT NOT NULL,
  amount INT NOT NULL,
  bidder VARCHAR(64) NOT NULL,
  request_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bids_car FOREIGN KEY (car_id) REFERENCES cars(id),
  UNIQUE KEY uk_request_id (request_id)
);

-- 最低限のインデックス例（要件に合わせて1つは必須）
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_bids_car_created ON bids(car_id, created_at);

