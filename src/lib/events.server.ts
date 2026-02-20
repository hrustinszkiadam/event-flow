import { db } from '@/database';
import { events } from '@/database/schema';
import { authMiddleware } from '@/middleware/auth';
import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { eq, desc, and } from 'drizzle-orm';
import z from 'zod';
import { showToast } from './utils';

export const getEventsForUser = createServerFn({ method: 'GET' })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			userId: z.string(),
		}),
	)
	.handler(async ({ data: { userId } }) => {
		const result = await db.query.events.findMany({
			where: eq(events.userId, userId),
			orderBy: desc(events.createdAt),
			with: {
				menu: true,
			},
		});
		return result;
	});

export const createEventsQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ['events', userId],
		queryFn: () => getEventsForUser({ data: { userId } }),
	});

export const getEventForUser = createServerFn({ method: 'GET' })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			userId: z.string(),
			eventId: z.number(),
		}),
	)
	.handler(async ({ data: { userId, eventId } }) => {
		return await db.query.events.findFirst({
			where: and(eq(events.userId, userId), eq(events.id, eventId)),
			with: {
				menu: true,
			},
		});
	});

export const createEventQueryOptions = (userId: string, eventId: number) =>
	queryOptions({
		queryKey: ['event', userId, eventId],
		queryFn: () => getEventForUser({ data: { userId, eventId } }),
	});

export const deleteEvent = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			userId: z.string(),
			eventId: z.number(),
		}),
	)
	.handler(async ({ data: { userId, eventId } }) => {
		const rows = await db
			.delete(events)
			.where(and(eq(events.userId, userId), eq(events.id, eventId)))
			.returning();
		if (rows.length === 0) {
			throw new Error('Event not found');
		}
	});

export const createDeleteEventMutationOptions = (
	userId: string,
	eventId: number,
) =>
	mutationOptions({
		mutationKey: ['deleteEvent', userId, eventId],
		mutationFn: () => deleteEvent({ data: { userId, eventId } }),
		onError: () => {
			showToast(
				'Error',
				'An error occurred while deleting the event. Please try again.',
				'error',
			);
		},
	});

export const getMenus = createServerFn({ method: 'GET' })
	.middleware([authMiddleware])
	.handler(async () => {
		return await db.query.menu.findMany({
			orderBy: (menu, { asc }) => [asc(menu.name)],
		});
	});

export const createMenusQueryOptions = () =>
	queryOptions({
		queryKey: ['menus'],
		queryFn: () => getMenus(),
	});

const createEventSchema = z.object({
	name: z.string().nonempty('Name is required'),
	type: z.string().nonempty('Type is required'),
	guestCount: z.number().int().positive('Guest count must be at least 1'),
	location: z.string().nonempty('Location is required'),
	date: z
		.string()
		.nonempty('Date is required')
		.refine((val) => !isNaN(Date.parse(val)), {
			message: 'Invalid date format',
		})
		.refine((val) => new Date(val) > new Date(), {
			message: 'Date must be in the future',
		}),
	menuId: z.number().int().positive('Please select a menu'),
	userId: z.string().nonempty(),
});

export const createEvent = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator(createEventSchema)
	.handler(async ({ data }) => {
		const [created] = await db
			.insert(events)
			.values({
				name: data.name,
				type: data.type,
				guestCount: data.guestCount,
				location: data.location,
				date: new Date(data.date),
				menuId: data.menuId,
				userId: data.userId,
			})
			.returning();
		return created;
	});

export const createCreateEventMutationOptions = (userId: string) =>
	mutationOptions({
		mutationKey: ['createEvent', userId],
		mutationFn: (data: {
			name: string;
			type: string;
			guestCount: number;
			location: string;
			date: string;
			menuId: number;
		}) =>
			createEvent({
				data: { ...data, userId },
			}),
		onError: () => {
			showToast(
				'Error',
				'An error occurred while creating the event. Please try again.',
				'error',
			);
		},
	});

const updateEventSchema = z.object({
	userId: z.string().nonempty(),
	eventId: z.number().int(),
	name: z.string().nonempty('Name is required'),
	type: z.string().nonempty('Type is required'),
	guestCount: z.number().int().positive('Guest count must be at least 1'),
	location: z.string().nonempty('Location is required'),
	date: z.string().nonempty('Date is required'),
	menuId: z.number().int().positive('Please select a menu'),
});

export const updateEvent = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator(updateEventSchema)
	.handler(async ({ data }) => {
		const [updated] = await db
			.update(events)
			.set({
				name: data.name,
				type: data.type,
				guestCount: data.guestCount,
				location: data.location,
				date: new Date(data.date),
				menuId: data.menuId,
			})
			.where(and(eq(events.userId, data.userId), eq(events.id, data.eventId)))
			.returning();

		if (!updated) {
			throw new Error('Event not found');
		}

		return updated;
	});

export const createUpdateEventMutationOptions = (
	userId: string,
	eventId: number,
) =>
	mutationOptions({
		mutationKey: ['updateEvent', userId, eventId],
		mutationFn: (data: {
			name: string;
			type: string;
			guestCount: number;
			location: string;
			date: string;
			menuId: number;
		}) =>
			updateEvent({
				data: { ...data, userId, eventId },
			}),
		onError: () => {
			showToast(
				'Error',
				'An error occurred while updating the event. Please try again.',
				'error',
			);
		},
	});
