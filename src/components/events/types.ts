export interface EventFormValues {
	name: string;
	type: string;
	location: string;
	guestCount: number;
	date: string;
	menuId: number;
}

export const EVENT_TYPES = [
	'Wedding',
	'Birthday',
	'Corporate',
	'Conference',
	'Party',
	'Gala',
	'Fundraiser',
	'Other',
] as const;

export const STEPS = [
	{ label: 'Basics', fields: ['name', 'type'] as const },
	{ label: 'Details', fields: ['location', 'date', 'guestCount'] as const },
	{ label: 'Menu', fields: ['menuId'] as const },
	{ label: 'Review', fields: [] as const },
] as const;
