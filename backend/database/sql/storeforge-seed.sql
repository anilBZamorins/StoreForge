-- ============================================================================
-- StoreForge — Complete database dump (schema + seed data)
-- ============================================================================
-- Creates BOTH databases ready to use, no artisan needed:
--   1. storeforge              (landlord / SuperAdmin control database)
--   2. storeforge_auraliving   (the Aura Living demo tenant database)
--
-- Import:   mysql -u root -p < storeforge-seed.sql
--           (or open in phpMyAdmin / MySQL Workbench and run)
--
-- Seeded logins (password for both accounts: "password"):
--   Store Owner:  owner@auraliving.com
--   Super Admin:  admin@storeforge.io
--
-- Safe to re-run: drops and recreates both databases.
-- Matches backend/database/migrations exactly — the migrations table is
-- pre-filled so `php artisan migrate` sees everything as already run.
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- 1. LANDLORD DATABASE — storeforge
-- ============================================================================
DROP DATABASE IF EXISTS `storeforge`;
CREATE DATABASE `storeforge` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `storeforge`;

CREATE TABLE `migrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `migration` VARCHAR(255) NOT NULL,
  `batch` INT NOT NULL
) ENGINE=InnoDB;

INSERT INTO `migrations` (`migration`, `batch`) VALUES
('0001_01_01_000000_create_users_table', 1),
('0001_01_01_000001_create_cache_table', 1),
('0001_01_01_000002_create_jobs_table', 1),
('2026_08_06_000050_create_personal_access_tokens_table', 1),
('2026_08_06_000100_create_plans_and_stores_tables', 1),
('2026_08_06_000200_add_role_and_store_to_users_table', 1),
('2026_08_06_000300_create_billing_and_registration_tables', 1),
('2026_08_06_000300_create_catalog_tables', 1),
('2026_08_06_000400_create_sales_tables', 1);

-- ---------- Laravel base tables ----------
CREATE TABLE `password_reset_tokens` (
  `email` VARCHAR(255) NOT NULL PRIMARY KEY,
  `token` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL
) ENGINE=InnoDB;

CREATE TABLE `sessions` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `payload` LONGTEXT NOT NULL,
  `last_activity` INT NOT NULL,
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB;

CREATE TABLE `cache` (
  `key` VARCHAR(255) NOT NULL PRIMARY KEY,
  `value` MEDIUMTEXT NOT NULL,
  `expiration` INT NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `cache_locks` (
  `key` VARCHAR(255) NOT NULL PRIMARY KEY,
  `owner` VARCHAR(255) NOT NULL,
  `expiration` INT NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `queue` VARCHAR(255) NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `attempts` TINYINT UNSIGNED NOT NULL,
  `reserved_at` INT UNSIGNED NULL,
  `available_at` INT UNSIGNED NOT NULL,
  `created_at` INT UNSIGNED NOT NULL,
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB;

CREATE TABLE `job_batches` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `total_jobs` INT NOT NULL,
  `pending_jobs` INT NOT NULL,
  `failed_jobs` INT NOT NULL,
  `failed_job_ids` LONGTEXT NOT NULL,
  `options` MEDIUMTEXT NULL,
  `cancelled_at` INT NULL,
  `created_at` INT NOT NULL,
  `finished_at` INT NULL
) ENGINE=InnoDB;

CREATE TABLE `failed_jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(255) NOT NULL UNIQUE,
  `connection` TEXT NOT NULL,
  `queue` TEXT NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `exception` LONGTEXT NOT NULL,
  `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE `personal_access_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `tokenable_type` VARCHAR(255) NOT NULL,
  `tokenable_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `token` VARCHAR(64) NOT NULL UNIQUE,
  `abilities` TEXT NULL,
  `last_used_at` TIMESTAMP NULL,
  `expires_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  KEY `pat_tokenable_index` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB;

-- ---------- StoreForge platform tables ----------
CREATE TABLE `plans` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `monthly_price` INT UNSIGNED NOT NULL,
  `yearly_price` INT UNSIGNED NOT NULL,
  `product_limit` INT UNSIGNED NULL,
  `admin_user_limit` INT UNSIGNED NULL,
  `custom_domain_limit` INT UNSIGNED NULL,
  `features` JSON NOT NULL,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB;

INSERT INTO `plans`
(`id`, `name`, `description`, `monthly_price`, `yearly_price`, `product_limit`, `admin_user_limit`, `custom_domain_limit`, `features`, `featured`, `created_at`, `updated_at`) VALUES
(1, 'Starter', 'For new stores getting started', 19, 190, 200, 1, 0,
 '["200 products", "1 admin user", "Subdomain store URL", "Email support"]', 0, NOW(), NOW()),
(2, 'Growth', 'For growing stores that need more', 49, 490, 2000, 5, 1,
 '["2,000 products", "5 admin users", "1 custom domain", "Priority support + chat"]', 1, NOW(), NOW()),
(3, 'Enterprise', 'For high-volume stores', 129, 1290, NULL, NULL, NULL,
 '["Unlimited products", "Unlimited admin users", "Unlimited custom domains", "Dedicated account manager"]', 0, NOW(), NOW());

CREATE TABLE `stores` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `database` VARCHAR(255) NOT NULL UNIQUE,
  `plan_id` BIGINT UNSIGNED NOT NULL,
  `billing_cycle` ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly',
  `status` ENUM('trial', 'active', 'cancelled') NOT NULL DEFAULT 'trial',
  `trial_ends_at` TIMESTAMP NULL,
  `stripe_customer_id` VARCHAR(255) NULL,
  `stripe_subscription_id` VARCHAR(255) NULL,
  `theme_color` VARCHAR(255) NOT NULL DEFAULT '#FF5A36',
  `support_email` VARCHAR(255) NULL,
  `support_phone` VARCHAR(255) NULL,
  `address` TEXT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  KEY `stores_stripe_customer_id_index` (`stripe_customer_id`),
  KEY `stores_stripe_subscription_id_index` (`stripe_subscription_id`),
  CONSTRAINT `stores_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
) ENGINE=InnoDB;

INSERT INTO `stores`
(`id`, `name`, `slug`, `database`, `plan_id`, `billing_cycle`, `status`, `theme_color`, `support_email`, `support_phone`, `address`, `created_at`, `updated_at`) VALUES
(1, 'Aura Living', 'auraliving', 'storeforge_auraliving', 2, 'monthly', 'active', '#FF5A36',
 'support@auraliving.com', '+1 (555) 220-4471', '221 Birchwood Lane, Austin, TX 78701', NOW(), NOW());

-- ---------- Users (password for both accounts: "password") ----------
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `email_verified_at` TIMESTAMP NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'store_owner', 'store_admin') NOT NULL DEFAULT 'store_owner',
  `store_id` BIGINT UNSIGNED NULL,
  `remember_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `users_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `store_id`, `created_at`, `updated_at`) VALUES
(1, 'Nikhil Rao', 'owner@auraliving.com',
 '$2y$12$ekqammtWqixmv5lRURwTROFF9NBaa0j0uwTTM2O5C0Zyb0.FkYr3e', 'store_owner', 1, NOW(), NOW()),
(2, 'Platform Admin', 'admin@storeforge.io',
 '$2y$12$ekqammtWqixmv5lRURwTROFF9NBaa0j0uwTTM2O5C0Zyb0.FkYr3e', 'super_admin', NULL, NOW(), NOW());

-- ---------- Billing / registrations / platform enquiries ----------
CREATE TABLE `invoices` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `store_id` BIGINT UNSIGNED NOT NULL,
  `number` VARCHAR(255) NOT NULL,
  `plan_name` VARCHAR(255) NOT NULL,
  `amount` INT UNSIGNED NOT NULL,
  `status` ENUM('Paid', 'Failed', 'Pending') NOT NULL DEFAULT 'Paid',
  `stripe_invoice_id` VARCHAR(255) NULL,
  `issued_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  UNIQUE KEY `invoices_store_id_number_unique` (`store_id`, `number`),
  CONSTRAINT `invoices_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `invoices` (`store_id`, `number`, `plan_name`, `amount`, `status`, `issued_at`, `created_at`, `updated_at`) VALUES
(1, 'INV-0231', 'Growth', 49, 'Paid', '2026-06-09 00:00:00', NOW(), NOW()),
(1, 'INV-0198', 'Growth', 49, 'Paid', '2026-05-09 00:00:00', NOW(), NOW()),
(1, 'INV-0165', 'Starter', 19, 'Paid', '2026-04-09 00:00:00', NOW(), NOW()),
(1, 'INV-0142', 'Starter', 19, 'Paid', '2026-03-09 00:00:00', NOW(), NOW());

CREATE TABLE `contact_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NULL,
  `topic` VARCHAR(255) NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB;

CREATE TABLE `pending_registrations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `stripe_session_id` VARCHAR(255) NULL UNIQUE,
  `business_name` VARCHAR(255) NOT NULL,
  `owner_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NULL,
  `plan_name` VARCHAR(255) NOT NULL,
  `billing_cycle` ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly',
  `status` ENUM('awaiting_payment', 'completed', 'failed') NOT NULL DEFAULT 'awaiting_payment',
  `result` JSON NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB;

-- ============================================================================
-- 2. TENANT DATABASE — storeforge_auraliving (Aura Living's own database)
-- ============================================================================
DROP DATABASE IF EXISTS `storeforge_auraliving`;
CREATE DATABASE `storeforge_auraliving` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `storeforge_auraliving`;

CREATE TABLE `migrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `migration` VARCHAR(255) NOT NULL,
  `batch` INT NOT NULL
) ENGINE=InnoDB;

INSERT INTO `migrations` (`migration`, `batch`) VALUES
('2026_08_06_000100_create_tenant_catalog_tables', 1),
('2026_08_06_000200_create_tenant_sales_tables', 1);

CREATE TABLE `categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `parent_id` BIGINT UNSIGNED NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Home Textiles', 'textiles', NOW(), NOW()),
(2, NULL, 'Decor', 'decor', NOW(), NOW()),
(3, NULL, 'Furniture', 'furniture', NOW(), NOW()),
(4, 1, 'Bedding & Linen', 'bedding', NOW(), NOW()),
(5, 1, 'Rugs & Throws', 'rugs', NOW(), NOW()),
(6, 2, 'Lighting', 'lighting', NOW(), NOW()),
(7, 2, 'Wall Art', 'wallart', NOW(), NOW()),
(8, 2, 'Vases & Planters', 'vases', NOW(), NOW()),
(9, 3, 'Seating', 'seating', NOW(), NOW()),
(10, 3, 'Tables', 'tables', NOW(), NOW());

CREATE TABLE `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `category_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `sku` VARCHAR(255) NOT NULL UNIQUE,
  `price` INT UNSIGNED NOT NULL,
  `discount_percent` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `stock` INT UNSIGNED NOT NULL DEFAULT 0,
  `emoji` VARCHAR(255) NOT NULL DEFAULT '📦',
  `image_url` VARCHAR(255) NULL,
  `rating` DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `latest` TINYINT(1) NOT NULL DEFAULT 0,
  `short_description` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `products`
(`id`, `category_id`, `name`, `sku`, `price`, `discount_percent`, `stock`, `emoji`, `rating`, `featured`, `latest`, `description`, `created_at`, `updated_at`) VALUES
(1, 4, 'Linen Weave Duvet Set', 'AL-BED-101', 129, 10, 52, '🛏️', 4.7, 1, 0, 'Woven from pre-washed European linen, this duvet set softens with every wash while keeping its shape season after season.', NOW(), NOW()),
(2, 4, 'Organic Cotton Pillowcases (Pair)', 'AL-BED-114', 39, 0, 88, '🛏️', 4.5, 0, 1, 'A pair of breathable, GOTS-certified organic cotton pillowcases with a smooth sateen finish.', NOW(), NOW()),
(3, 5, 'Handwoven Jute Area Rug', 'AL-RUG-208', 189, 15, 21, '🧶', 4.6, 1, 0, 'Handwoven by artisan partners using natural jute fiber — warmth and texture underfoot.', NOW(), NOW()),
(4, 5, 'Chunky Knit Throw Blanket', 'AL-RUG-219', 69, 0, 9, '🧣', 4.8, 0, 1, 'Oversized and cable-knit from a soft acrylic-wool blend.', NOW(), NOW()),
(5, 6, 'Rattan Pendant Light Shade', 'AL-LGT-303', 99, 0, 34, '💡', 4.4, 1, 0, 'Hand-woven natural rattan casts warm, dappled light across any room.', NOW(), NOW()),
(6, 6, 'Ceramic Table Lamp', 'AL-LGT-311', 79, 12, 5, '🪔', 4.3, 0, 0, 'A hand-glazed ceramic base paired with a soft linen shade.', NOW(), NOW()),
(7, 7, 'Abstract Line Art Print Set', 'AL-ART-402', 59, 0, 62, '🖼️', 4.6, 0, 1, 'A set of three minimalist line-art prints on archival matte paper.', NOW(), NOW()),
(8, 8, 'Terracotta Wall Planter Trio', 'AL-VAS-517', 45, 8, 0, '🪴', 4.2, 0, 0, 'Three graduated terracotta planters with hidden wall mounts.', NOW(), NOW()),
(9, 8, 'Fluted Ceramic Vase, Large', 'AL-VAS-522', 65, 0, 27, '🏺', 4.7, 1, 0, 'A sculptural fluted vase in matte-glazed ceramic.', NOW(), NOW()),
(10, 9, 'Boucle Accent Armchair', 'AL-FUR-601', 449, 5, 6, '🛋️', 4.8, 1, 1, 'Curved boucle upholstery over a solid hardwood frame.', NOW(), NOW()),
(11, 10, 'Oak Round Side Table', 'AL-FUR-612', 219, 0, 14, '🪑', 4.5, 0, 1, 'Solid white oak with a hand-oiled finish.', NOW(), NOW()),
(12, 9, 'Woven Rattan Bench', 'AL-FUR-618', 279, 10, 3, '🪑', 4.4, 0, 0, 'A breezy rattan-and-teak bench for entryways and bedroom ends.', NOW(), NOW());

CREATE TABLE `banners` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `kind` ENUM('Homepage Banner', 'Category Banner', 'Offer Banner') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) NULL,
  `color1` VARCHAR(255) NOT NULL DEFAULT '#0F172A',
  `color2` VARCHAR(255) NOT NULL DEFAULT '#16213E',
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB;

INSERT INTO `banners` (`id`, `kind`, `title`, `subtitle`, `color1`, `color2`, `active`, `created_at`, `updated_at`) VALUES
(1, 'Homepage Banner', 'Summer Refresh', 'Up to 20% off Bedding & Linen', '#0F172A', '#16213E', 1, NOW(), NOW()),
(2, 'Category Banner', 'New in Decor', 'Lighting & wall art just landed', '#3B2F6C', '#6C4FCE', 1, NOW(), NOW()),
(3, 'Offer Banner', 'Free Shipping', 'On orders over $99 this week', '#B4790C', '#FF5A36', 1, NOW(), NOW());

CREATE TABLE `customers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(255) NULL,
  `city` VARCHAR(255) NULL,
  `joined_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB;

INSERT INTO `customers` (`id`, `name`, `email`, `phone`, `city`, `joined_at`, `created_at`, `updated_at`) VALUES
(1, 'Grace Kim', 'grace.kim@gmail.com', '+1 512 555 0142', 'Austin', '2025-01-12', NOW(), NOW()),
(2, 'Marcus Cole', 'marcus.cole@gmail.com', '+1 720 555 0177', 'Denver', '2025-03-03', NOW(), NOW()),
(3, 'Priya Chandran', 'priya.c@outlook.com', '+1 206 555 0118', 'Seattle', '2025-05-21', NOW(), NOW()),
(4, 'Daniel Osei', 'daniel.osei@gmail.com', '+1 503 555 0164', 'Portland', '2025-09-02', NOW(), NOW()),
(5, 'Sofia Martinez', 'sofia.m@yahoo.com', '+1 512 555 0199', 'Austin', '2025-11-19', NOW(), NOW()),
(6, 'Ravi Desai', 'ravi.desai@gmail.com', '+1 312 555 0155', 'Chicago', '2025-01-27', NOW(), NOW()),
(7, 'Emily Zhang', 'emily.zhang@gmail.com', '+1 415 555 0188', 'San Francisco', '2025-06-10', NOW(), NOW()),
(8, 'Noah Bennett', 'noah.bennett@gmail.com', '+1 646 555 0102', 'New York', '2025-07-14', NOW(), NOW()),
(9, 'Aaliyah Brooks', 'aaliyah.b@outlook.com', '+1 773 555 0141', 'Chicago', '2025-08-30', NOW(), NOW()),
(10, 'Chris Palmer', 'chris.palmer@gmail.com', '+1 214 555 0176', 'Dallas', '2025-10-05', NOW(), NOW()),
(11, 'Isabella Turner', 'isabella.t@yahoo.com', '+1 617 555 0193', 'Boston', '2025-12-01', NOW(), NOW()),
(12, 'Liam O''Connor', 'liam.oconnor@gmail.com', '+1 619 555 0133', 'San Diego', '2026-01-15', NOW(), NOW()),
(13, 'Emma Fischer', 'emma.f@gmail.com', '+1 615 555 0121', 'Nashville', '2026-02-20', NOW(), NOW());

CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `customer_id` BIGINT UNSIGNED NULL,
  `number` VARCHAR(255) NOT NULL UNIQUE,
  `status` ENUM('Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `payment_method` ENUM('COD', 'Card') NOT NULL DEFAULT 'COD',
  `total` INT UNSIGNED NOT NULL,
  `tracking_number` VARCHAR(255) NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(255) NULL,
  `delivery_address` TEXT NULL,
  `placed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO `orders`
(`id`, `customer_id`, `number`, `status`, `payment_method`, `total`, `tracking_number`, `customer_name`, `customer_phone`, `delivery_address`, `placed_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'AL-3081', 'Delivered', 'COD', 185, 'USPS3384211', 'Grace Kim', '+1 512 555 0142', '12 Willow St, Austin, TX 78701', '2026-07-06 10:00:00', NOW(), NOW()),
(2, 2, 'AL-3082', 'Out for Delivery', 'COD', 161, 'USPS3384255', 'Marcus Cole', '+1 720 555 0177', '44 Elmwood Ave, Denver, CO 80202', '2026-07-07 10:00:00', NOW(), NOW()),
(3, 3, 'AL-3083', 'Shipped', 'COD', 223, 'USPS3384299', 'Priya Chandran', '+1 206 555 0118', '7B Lakeview Dr, Seattle, WA 98101', '2026-07-07 12:00:00', NOW(), NOW()),
(4, 4, 'AL-3084', 'Processing', 'COD', 427, NULL, 'Daniel Osei', '+1 503 555 0164', '21 Cedar Ln, Portland, OR 97201', '2026-07-08 10:00:00', NOW(), NOW()),
(5, 5, 'AL-3085', 'Pending', 'COD', 104, NULL, 'Sofia Martinez', '+1 512 555 0199', '5 Ridge Rd, Austin, TX 78704', '2026-07-08 14:00:00', NOW(), NOW()),
(6, 12, 'AL-3086', 'Pending', 'COD', 70, NULL, 'Liam O''Connor', '+1 619 555 0133', '18 Bayview St, San Diego, CA 92101', '2026-07-09 09:00:00', NOW(), NOW()),
(7, 13, 'AL-3087', 'Cancelled', 'COD', 65, NULL, 'Emma Fischer', '+1 615 555 0121', '9 Rose Ct, Nashville, TN 37201', '2026-07-09 11:00:00', NOW(), NOW()),
(8, 6, 'AL-3088', 'Processing', 'COD', 220, NULL, 'Ravi Desai', '+1 312 555 0155', '33 Highland Ave, Chicago, IL 60614', '2026-07-09 15:00:00', NOW(), NOW());

CREATE TABLE `order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NULL,
  `name` VARCHAR(255) NOT NULL,
  `quantity` INT UNSIGNED NOT NULL,
  `unit_price` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- unit_price = discounted price at purchase time
INSERT INTO `order_items` (`order_id`, `product_id`, `name`, `quantity`, `unit_price`, `created_at`, `updated_at`) VALUES
(1, 1, 'Linen Weave Duvet Set', 1, 116, NOW(), NOW()),
(1, 4, 'Chunky Knit Throw Blanket', 1, 69, NOW(), NOW()),
(2, 3, 'Handwoven Jute Area Rug', 1, 161, NOW(), NOW()),
(3, 5, 'Rattan Pendant Light Shade', 1, 99, NOW(), NOW()),
(3, 7, 'Abstract Line Art Print Set', 1, 59, NOW(), NOW()),
(3, 9, 'Fluted Ceramic Vase, Large', 1, 65, NOW(), NOW()),
(4, 10, 'Boucle Accent Armchair', 1, 427, NOW(), NOW()),
(5, 2, 'Organic Cotton Pillowcases (Pair)', 1, 39, NOW(), NOW()),
(5, 9, 'Fluted Ceramic Vase, Large', 1, 65, NOW(), NOW()),
(6, 6, 'Ceramic Table Lamp', 1, 70, NOW(), NOW()),
(7, 9, 'Fluted Ceramic Vase, Large', 1, 65, NOW(), NOW()),
(8, 3, 'Handwoven Jute Area Rug', 1, 161, NOW(), NOW()),
(8, 7, 'Abstract Line Art Print Set', 1, 59, NOW(), NOW());

CREATE TABLE `carts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `customer_id` BIGINT UNSIGNED NULL,
  `last_activity_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `carts_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Idle hours from the mock data: 5h Active, 312h Abandoned, 14h Active, 487h Abandoned, 22h Active
INSERT INTO `carts` (`id`, `customer_id`, `last_activity_at`, `created_at`, `updated_at`) VALUES
(1, 7, DATE_SUB(NOW(), INTERVAL 5 HOUR), NOW(), NOW()),
(2, 8, DATE_SUB(NOW(), INTERVAL 312 HOUR), NOW(), NOW()),
(3, 9, DATE_SUB(NOW(), INTERVAL 14 HOUR), NOW(), NOW()),
(4, 10, DATE_SUB(NOW(), INTERVAL 487 HOUR), NOW(), NOW()),
(5, 11, DATE_SUB(NOW(), INTERVAL 22 HOUR), NOW(), NOW());

CREATE TABLE `cart_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `cart_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `cart_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `cart_items` (`cart_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NOW(), NOW()), (1, 5, 2, NOW(), NOW()),
(2, 10, 1, NOW(), NOW()),
(3, 3, 1, NOW(), NOW()), (3, 9, 1, NOW(), NOW()), (3, 11, 1, NOW(), NOW()),
(4, 6, 1, NOW(), NOW()),
(5, 2, 3, NOW(), NOW()), (5, 7, 1, NOW(), NOW());

CREATE TABLE `contact_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NULL,
  `order_number` VARCHAR(255) NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- Done. Databases ready:
--   storeforge (landlord)  +  storeforge_auraliving (tenant)
-- Point backend/.env at DB_DATABASE=storeforge and run: php artisan serve
-- Logins: owner@auraliving.com / password  ·  admin@storeforge.io / password
-- ============================================================================
