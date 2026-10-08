CREATE TABLE `invoices` (
	`owner` text NOT NULL,
	`id` text NOT NULL,
	`data` text NOT NULL,
	`review` text,
	`created` integer NOT NULL,
	PRIMARY KEY(`owner`, `id`)
);
--> statement-breakpoint
CREATE INDEX `idx_invoices_owner_created` ON `invoices` (`owner`,`created`);--> statement-breakpoint
CREATE TABLE `payouts` (
	`owner` text NOT NULL,
	`invoice_id` text NOT NULL,
	`invoice_key` text NOT NULL,
	`sender_batch` text NOT NULL,
	`paypal_batch` text,
	`status` text NOT NULL,
	`mode` text NOT NULL,
	`error` text,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	PRIMARY KEY(`owner`, `invoice_id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_payouts_owner_invoice_key` ON `payouts` (`owner`,`invoice_key`);