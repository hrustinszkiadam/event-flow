import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { STEPS } from './types';

interface StepIndicatorProps {
	currentStep: number;
	onStepClick: (step: number) => void;
	completedSteps: Set<number>;
}

export function StepIndicator({
	currentStep,
	onStepClick,
	completedSteps,
}: StepIndicatorProps) {
	return (
		<nav
			aria-label='Form steps'
			className='mb-8'
		>
			<ol className='flex items-center justify-center gap-0'>
				{STEPS.map((step, index) => {
					const isActive = index === currentStep;
					const isCompleted = completedSteps.has(index);
					const isClickable = isCompleted || index === currentStep;

					return (
						<li
							key={step.label}
							className='flex items-start'
						>
							{/* Connector line before (skip first) */}
							{index > 0 && (
								<div
									className={cn(
										'h-0.5 w-8 sm:w-12 md:w-16 transition-colors duration-200 mt-4.5',
										isCompleted || isActive
											? 'bg-primary'
											: 'bg-muted-foreground/25',
									)}
								/>
							)}

							{/* Step circle + label */}
							<button
								type='button'
								onClick={() => isClickable && onStepClick(index)}
								disabled={!isClickable}
								className={cn(
									'flex flex-col items-center gap-1.5 group',
									isClickable
										? 'cursor-pointer'
										: 'cursor-not-allowed opacity-50',
								)}
								aria-current={isActive ? 'step' : undefined}
							>
								<div
									className={cn(
										'flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200',
										isActive &&
											'border-primary bg-primary text-primary-foreground scale-110',
										isCompleted &&
											!isActive &&
											'border-primary bg-primary/10 text-primary',
										!isActive &&
											!isCompleted &&
											'border-muted-foreground/30 text-muted-foreground',
									)}
								>
									{isCompleted && !isActive ? (
										<Check className='size-4' />
									) : (
										index + 1
									)}
								</div>
								<span
									className={cn(
										'text-xs font-medium transition-colors hidden sm:block',
										isActive && 'text-primary',
										!isActive && 'text-muted-foreground',
									)}
								>
									{step.label}
								</span>
							</button>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
