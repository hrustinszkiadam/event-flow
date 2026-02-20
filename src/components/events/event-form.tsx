import { useState } from 'react';
import { useEventForm } from '@/hooks/event-form';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createMenusQueryOptions } from '@/lib/events.server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StepIndicator } from './step-indicator';
import { StepBasics } from './step-basics';
import { StepDetails } from './step-details';
import { StepMenu } from './step-menu';
import { StepReview } from './step-review';

import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react';
import z from 'zod';
import { STEPS, type EventFormValues } from './types';
import { Link } from '@tanstack/react-router';
export type { EventFormValues } from './types';

const eventFormSchema = z.object({
	name: z.string().nonempty('Name is required'),
	type: z.string().nonempty('Type is required'),
	location: z.string().nonempty('Location is required'),
	guestCount: z
		.number({ error: 'Guest count is required' })
		.int()
		.positive('Guest count must be at least 1'),
	date: z
		.string()
		.nonempty('Date is required')
		.refine((val) => !isNaN(Date.parse(val)), {
			message: 'Invalid date format',
		})
		.refine((val) => new Date(val) > new Date(), {
			message: 'Date must be in the future',
		}),
	menuId: z
		.number({ error: 'Please select a menu' })
		.int()
		.positive('Please select a menu'),
});

// Per-step validation schemas
const stepSchemas = [
	z.object({
		name: z.string().nonempty('Name is required'),
		type: z.string().nonempty('Type is required'),
	}),
	z.object({
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
		guestCount: z
			.number({ error: 'Guest count is required' })
			.int()
			.positive('Guest count must be at least 1'),
	}),
	z.object({
		menuId: z
			.number({ error: 'Please select a menu' })
			.int()
			.positive('Please select a menu'),
	}),
	z.object({}), // Review step — no validation
];

interface EventFormProps {
	defaultValues?: Partial<EventFormValues>;
	onSubmit: (values: EventFormValues) => void | Promise<void>;
	isPending?: boolean;
	submitLabel?: string;
}

export function EventForm({
	defaultValues,
	onSubmit,
	isPending = false,
	submitLabel = 'Create Event',
}: EventFormProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [completedSteps, setCompletedSteps] = useState<Set<number>>(() =>
		defaultValues
			? new Set(STEPS.slice(0, STEPS.length - 1).map((_, i) => i))
			: new Set(),
	);

	const { data: menus } = useSuspenseQuery(createMenusQueryOptions());

	const form = useEventForm({
		defaultValues: {
			name: defaultValues?.name ?? '',
			type: defaultValues?.type ?? '',
			location: defaultValues?.location ?? '',
			guestCount: defaultValues?.guestCount ?? 0,
			date: defaultValues?.date ?? '',
			menuId: defaultValues?.menuId ?? 0,
		} satisfies EventFormValues,
		validators: {
			onSubmit: eventFormSchema,
		},
		onSubmit: ({ value }) => {
			onSubmit(value);
		},
	});

	const validateCurrentStep = (): boolean => {
		const schema = stepSchemas[currentStep];
		const formValues = {
			name: form.getFieldValue('name'),
			type: form.getFieldValue('type'),
			location: form.getFieldValue('location'),
			guestCount: form.getFieldValue('guestCount'),
			date: form.getFieldValue('date'),
			menuId: form.getFieldValue('menuId'),
		};
		const result = schema.safeParse(formValues);
		return result.success;
	};

	const touchStepFields = () => {
		const stepFields = STEPS[currentStep].fields;
		for (const fieldName of stepFields) {
			form.validateField(fieldName, 'change');
		}
	};

	const handleNext = () => {
		touchStepFields();

		// Small delay to let validation run
		requestAnimationFrame(() => {
			if (validateCurrentStep()) {
				setCompletedSteps((prev) => new Set([...prev, currentStep]));
				setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
			}
		});
	};

	const handleBack = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const handleStepClick = (step: number) => {
		if (completedSteps.has(step) || step === currentStep) {
			setCurrentStep(step);
		}
	};

	const handleFormSubmit = (e: React.SubmitEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (currentStep < STEPS.length - 1) {
			handleNext();
		} else {
			// Mark all steps as completed and submit
			setCompletedSteps(new Set(STEPS.map((_, i) => i)));
			form.handleSubmit();
		}
	};

	const isLastStep = currentStep === STEPS.length - 1;
	const isFirstStep = currentStep === 0;

	return (
		<div className='w-full max-w-2xl mx-auto'>
			<StepIndicator
				currentStep={currentStep}
				onStepClick={handleStepClick}
				completedSteps={completedSteps}
			/>

			<Card>
				<CardContent className='pt-6'>
					<form onSubmit={handleFormSubmit}>
						<div className='mb-6'>
							{currentStep === 0 && <StepBasics form={form} />}
							{currentStep === 1 && <StepDetails form={form} />}
							{currentStep === 2 && (
								<StepMenu
									form={form}
									menus={menus}
								/>
							)}
							{currentStep === 3 && (
								<StepReview
									form={form}
									menus={menus}
								/>
							)}
						</div>

						<div className='flex items-center justify-between pt-4 border-t'>
							<Button
								type='button'
								variant='outline'
								onClick={handleBack}
								disabled={isFirstStep}
								className='gap-1.5'
							>
								<ArrowLeft className='size-4' />
								Back
							</Button>

							{isLastStep ? (
								<Button
									type='submit'
									disabled={isPending}
									className='gap-1.5'
								>
									{isPending ? (
										<>
											<Loader2 className='size-4 animate-spin' />
											Saving...
										</>
									) : (
										<>
											<Save className='size-4' />
											{submitLabel}
										</>
									)}
								</Button>
							) : (
								<Button
									type='submit'
									className='gap-1.5'
								>
									Next
									<ArrowRight className='size-4' />
								</Button>
							)}
						</div>
					</form>
				</CardContent>
			</Card>

			<Button
				variant='outline'
				className='mt-4 flex mx-auto'
				asChild
			>
				<Link to='..'>Cancel</Link>
			</Button>
		</div>
	);
}
