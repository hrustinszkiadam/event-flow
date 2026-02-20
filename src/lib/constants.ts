export const statusVariant: Record<
	string,
	'default' | 'secondary' | 'destructive' | 'outline'
> = {
	confirmed: 'default',
	pending: 'outline',
	cancelled: 'destructive',
} as const;
