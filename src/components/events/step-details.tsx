import { withForm } from '@/hooks/event-form';
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { EventFormValues } from './types';
import z from 'zod';

export const StepDetails = withForm({
	defaultValues: {} as EventFormValues,
	render: ({ form }) => {
		return (
			<FieldGroup>
				<form.AppField
					name='location'
					validators={{
						onChange: z.string().nonempty('Location is required'),
					}}
				>
					{(field) => (
						<Field
							data-invalid={
								(field.state.meta.errors.length > 0 &&
									!field.state.meta.isTouched) ||
								undefined
							}
						>
							<FieldLabel htmlFor={field.name}>Location</FieldLabel>
							<FieldContent>
								<Input
									id={field.name}
									placeholder='e.g. Grand Ballroom, Downtown Hotel'
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									aria-invalid={field.state.meta.errors.length > 0}
								/>
								<FieldError errors={field.state.meta.errors} />
							</FieldContent>
						</Field>
					)}
				</form.AppField>

				<form.AppField
					name='date'
					validators={{
						onChange: z
							.string()
							.nonempty('Date is required')
							.refine((val) => !isNaN(Date.parse(val)), {
								message: 'Invalid date format',
							})
							.refine((val) => new Date(val) > new Date(), {
								message: 'Date must be in the future',
							}),
					}}
				>
					{(field) => (
						<Field
							data-invalid={
								(field.state.meta.errors.length > 0 &&
									!field.state.meta.isTouched) ||
								undefined
							}
						>
							<FieldLabel htmlFor={field.name}>Event Date</FieldLabel>
							<FieldContent>
								<Input
									id={field.name}
									type='date'
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									aria-invalid={field.state.meta.errors.length > 0}
								/>
								<FieldError errors={field.state.meta.errors} />
							</FieldContent>
						</Field>
					)}
				</form.AppField>

				<form.AppField
					name='guestCount'
					validators={{
						onChange: z
							.number({ error: 'Guest count is required' })
							.int()
							.positive('Guest count must be at least 1'),
					}}
				>
					{(field) => (
						<Field
							data-invalid={
								(field.state.meta.errors.length > 0 &&
									!field.state.meta.isTouched) ||
								undefined
							}
						>
							<FieldLabel htmlFor={field.name}>Guest Count</FieldLabel>
							<FieldContent>
								<Input
									id={field.name}
									type='number'
									placeholder='e.g. 150'
									value={field.state.value?.toString() ?? ''}
									onChange={(e) =>
										field.handleChange(
											e.target.value ? Number(e.target.value) : 0,
										)
									}
									onBlur={field.handleBlur}
									aria-invalid={field.state.meta.errors.length > 0}
								/>
								<FieldError errors={field.state.meta.errors} />
							</FieldContent>
						</Field>
					)}
				</form.AppField>
			</FieldGroup>
		);
	},
});
