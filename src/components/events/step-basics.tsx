import { withForm } from '@/hooks/event-form';
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { EVENT_TYPES } from './types';
import type { EventFormValues } from './types';
import z from 'zod';

export const StepBasics = withForm({
	defaultValues: {} as EventFormValues,
	render: ({ form }) => {
		return (
			<FieldGroup>
				<form.AppField
					name='name'
					validators={{ onChange: z.string().nonempty('Name is required') }}
				>
					{(field) => (
						<Field
							data-invalid={field.state.meta.errors.length > 0 || undefined}
						>
							<FieldLabel htmlFor={field.name}>Event Name</FieldLabel>
							<FieldContent>
								<Input
									id={field.name}
									placeholder='e.g. Annual Company Gala'
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
					name='type'
					validators={{ onChange: z.string().nonempty('Type is required') }}
				>
					{(field) => (
						<Field
							data-invalid={field.state.meta.errors.length > 0 || undefined}
						>
							<FieldLabel htmlFor={field.name}>Event Type</FieldLabel>
							<FieldContent>
								<Select
									value={field.state.value}
									onValueChange={(value) => field.handleChange(value)}
								>
									<SelectTrigger
										id={field.name}
										className='w-full'
										aria-invalid={field.state.meta.errors.length > 0}
									>
										<SelectValue placeholder='Select a type' />
									</SelectTrigger>
									<SelectContent>
										{EVENT_TYPES.map((type) => (
											<SelectItem
												key={type}
												value={type}
											>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError errors={field.state.meta.errors} />
							</FieldContent>
						</Field>
					)}
				</form.AppField>
			</FieldGroup>
		);
	},
});
