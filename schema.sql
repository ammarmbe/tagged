CREATE TYPE address AS (
    street TEXT,
    apartment TEXT,
    city TEXT,
    phone_number VARCHAR(11),
    last_name TEXT,
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(64) NOT NULL,
  pfp_url TEXT,
  hashed_password TEXT NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  feature_flags JSONB NOT NULL DEFAULT '{
    "description": "",
    "tiktok": null,
    "facebook": null,
    "instagram": null,
    "dark_mode": false,
    "table_size": "comfortable",
    "notifications": true,
    "return_period": "",
    "shipping_price": 0,
    "exchange_period": "3d",
    "allowed_gov": []
  }',
  nano_id VARCHAR(10) NOT NULL UNIQUE,
  store BOOLEAN NOT NULL DEFAULT FALSE,
  "address" address,
  governorate TEXT,
);

CREATE INDEX user_store_idx ON users(store);

CREATE TABLE email_verification_codes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 day',
  email VARCHAR(254) NOT NULL
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  expires_at TIMESTAMPTZ NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
);

CREATE INDEX session_user_id_idx ON sessions(user_id);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "name" VARCHAR(128) NOT NULL,
  "description" VARCHAR(2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  price INT NOT NULL,
  discount INT NOT NULL DEFAULT 0,
  category VARCHAR(64)[] NOT NULL,
  nano_id VARCHAR(10) NOT NULL UNIQUE,
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX item_store_id_idx ON items(store_id);
CREATE INDEX item_category_idx ON items USING GIN(category);
CREATE INDEX item_name_idx ON items("name");

CREATE TABLE item_configs (
  id SERIAL PRIMARY KEY,
  item_id INT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  "size" VARCHAR(64) NOT NULL,
  "color" VARCHAR(64) NOT NULL,
  quantity INT NOT NULL,
  color_hex VARCHAR(7) NOT NULL,
);

CREATE INDEX item_config_item_id_idx ON item_configs(item_id);

CREATE TABLE views (
  id SERIAL PRIMARY KEY,
  item_id INT REFERENCES items(id) ON DELETE CASCADE,
  store_id INT REFERENCES users(id) ON DELETE CASCADE,
  ip VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX view_item_id_idx ON views(item_id);
CREATE INDEX view_store_id_idx ON views(store_id);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "address" address NOT NULL,
  "status" TEXT NOT NULL,
  governorate TEXT NOT NULL,
  cancel_reason TEXT,
  nano_id VARCHAR(10) NOT NULL UNIQUE,
  completed_at TIMESTAMPTZ,
  shipping_price INT NOT NULL,
  first_name TEXT NOT NULL
);

CREATE INDEX order_store_id_idx ON orders(store_id);
CREATE INDEX order_user_id_idx ON orders(user_id);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "read" BOOLEAN NOT NULL DEFAULT FALSE,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  "message" TEXT,
);

CREATE INDEX notification_store_id_idx ON notifications(store_id);

CREATE TABLE order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  "status" TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);

CREATE INDEX order_status_history_order_id_idx ON order_status_history(order_id);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE SET NULL,
  item_id INT REFERENCES items(id) ON DELETE SET NULL,
  quantity INT NOT NULL,
  price INT NOT NULL,
  discount INT NOT NULL DEFAULT 0,
  "size" VARCHAR(64) NOT NULL,
  "color" VARCHAR(64) NOT NULL,
  "name" VARCHAR(128) NOT NULL,
);

CREATE INDEX order_item_order_id_idx ON order_items(order_id);

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  quantity INT NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  item_config_id INT NOT NULL REFERENCES item_configs(id) ON DELETE CASCADE,
);

CREATE INDEX cart_item_user_id_idx ON cart_items(user_id);

CREATE TABLE incorrect_attempts (
  id SERIAL PRIMARY KEY,
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ip_idx ON incorrect_attempts (id);

CREATE TABLE password_reset_codes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL,
  user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 hour'
);

CREATE TABLE item_images (
  id TEXT PRIMARY KEY,
  item_id INT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  color TEXT,
  thumbnail BOOLEAN NOT NULL DEFAULT FALSE,
  size INT NOT NULL,
);