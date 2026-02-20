import { withForm } from '@/hooks/event-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
	CalendarDays,
	MapPin,
	Users,
	UtensilsCrossed,
	Tag,
	FileText,
} from 'lucide-react';
import type { EventFormValues } from './types';

interface Menu {
	id: number;
	name: string;
	description: string;
}

function ReviewField({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: string;
}) {
	return (
		<div className='flex items-center gap-3'>
			<div className='flex size-9 items-center justify-center rounded-md bg-muted'>
				<Icon className='size-4 text-muted-foreground' />
			</div>
			<div>
				<dt className='text-xs text-muted-foreground'>{label}</dt>
				<dd className='text-sm font-medium'>{value || '—'}</dd>
			</div>
		</div>
	);
}

export const StepReview = withForm({
	defaultValues: {} as EventFormValues,
	props: {
		menus: [] as Menu[],
	},
	render: ({ form, menus }) => {
		return (
			<div className='space-y-4'>
				<Card>
					<CardHeader className='pb-3'>
						<CardTitle className='text-lg'>Event Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<dl className='grid gap-4 sm:grid-cols-2'>
							<form.AppField name='name'>
								{(field) => (
									<ReviewField
										icon={FileText}
										label='Name'
										value={field.state.value}
									/>
								)}
							</form.AppField>

							<form.AppField name='type'>
								{(field) => (
									<ReviewField
										icon={Tag}
										label='Type'
										value={field.state.value}
									/>
								)}
							</form.AppField>

							<form.AppField name='location'>
								{(field) => (
									<ReviewField
										icon={MapPin}
										label='Location'
										value={field.state.value}
									/>
								)}
							</form.AppField>

							<form.AppField name='guestCount'>
								{(field) => (
									<ReviewField
										icon={Users}
										label='Guests'
										value={
											field.state.value
												? `${field.state.value} ${field.state.value === 1 ? 'guest' : 'guests'}`
												: ''
										}
									/>
								)}
							</form.AppField>

							<form.AppField name='date'>
								{(field) => (
									<ReviewField
										icon={CalendarDays}
										label='Date'
										value={
											field.state.value
												? new Date(field.state.value).toLocaleDateString(
														undefined,
														{
															weekday: 'long',
															year: 'numeric',
															month: 'long',
															day: 'numeric',
														},
													)
												: ''
										}
									/>
								)}
							</form.AppField>

							<form.AppField name='menuId'>
								{(field) => {
									const selectedMenu = menus.find(
										(m) => m.id === field.state.value,
									);
									return (
										<ReviewField
											icon={UtensilsCrossed}
											label='Menu'
											value={selectedMenu?.name ?? ''}
										/>
									);
								}}
							</form.AppField>
						</dl>

						<form.AppField name='menuId'>
							{(field) => {
								const selectedMenu = menus.find(
									(m) => m.id === field.state.value,
								);
								if (!selectedMenu) return null;
								return (
									<>
										<Separator className='my-4' />
										<div>
											<span className='text-xs text-muted-foreground'>
												Menu Description
											</span>
											<p className='text-sm mt-1'>{selectedMenu.description}</p>
										</div>
									</>
								);
							}}
						</form.AppField>
					</CardContent>
				</Card>
			</div>
		);
	},
});
