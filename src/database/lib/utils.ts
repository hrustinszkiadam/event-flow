import { integer, timestamp } from 'drizzle-orm/pg-core';

export const id = () =>
	integer('id').primaryKey().generatedAlwaysAsIdentity({
		startWith: 1,
	});
export const createdAt = () => timestamp('created_at').defaultNow().notNull();
export const updatedAt = () =>
	timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull();
