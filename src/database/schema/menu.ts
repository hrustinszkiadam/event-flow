import { pgTable, text } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../lib/utils';
import { relations } from 'drizzle-orm';
import { events } from './event';

export const menu = pgTable('menu', {
	id: id(),
	name: text('name').notNull().unique(),
	description: text('description').notNull(),
	createdAt: createdAt(),
	updatedAt: updatedAt(),
});

export const menuRelations = relations(menu, ({ many }) => ({
	events: many(events),
}));
