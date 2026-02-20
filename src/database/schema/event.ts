import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../lib/utils';
import { menu } from './menu';
import { eventStatuses } from '../lib/definitions';
import { user } from './auth';
import { relations } from 'drizzle-orm';

export const eventStatusEnum = pgEnum('event_status', eventStatuses);

export const events = pgTable('events', {
	id: id(),
	name: text('name').notNull(),
	type: text('type').notNull(),
	guestCount: integer('guest_count').notNull(),
	location: text('location').notNull(),
	date: timestamp('date').notNull(),
	status: eventStatusEnum('status').notNull().default('pending'),
	menuId: integer('menu_id')
		.notNull()
		.references(() => menu.id, { onDelete: 'restrict' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: createdAt(),
	updatedAt: updatedAt(),
});

export const eventRelations = relations(events, ({ one }) => ({
	menu: one(menu, { fields: [events.menuId], references: [menu.id] }),
	user: one(user, { fields: [events.userId], references: [user.id] }),
}));
