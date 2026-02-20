export const eventStatuses = ['pending', 'confirmed', 'cancelled'] as const;
export type EventStatus = (typeof eventStatuses)[number];
