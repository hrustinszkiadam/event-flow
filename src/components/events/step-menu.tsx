import { useState } from 'react';
import { withForm } from '@/hooks/event-form';
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EventFormValues } from './types';
import z from 'zod';

interface Menu {
	id: number;
	name: string;
	description: string;
}

export const StepMenu = withForm({
	defaultValues: {} as EventFormValues,
	props: {
		menus: [] as Menu[],
	},
	render: ({ form, menus }) => {
		const [dialogOpen, setDialogOpen] = useState(false);

		return (
			<FieldGroup>
				<form.AppField
					name='menuId'
					validators={{
						onChange: z
							.number({ error: 'Please select a menu' })
							.int()
							.positive('Please select a menu'),
					}}
				>
					{(field) => {
						const selectedMenu = menus.find((m) => m.id === field.state.value);

						return (
							<Field
								data-invalid={field.state.meta.errors.length > 0 || undefined}
							>
								<FieldLabel>Menu Selection</FieldLabel>
								<FieldContent>
									<AlertDialog
										open={dialogOpen}
										onOpenChange={setDialogOpen}
									>
										<AlertDialogTrigger asChild>
											<Button
												type='button'
												variant='outline'
												className={cn(
													'w-full justify-start gap-2 h-auto py-3',
													!selectedMenu && 'text-muted-foreground',
												)}
											>
												<UtensilsCrossed className='size-4 shrink-0' />
												{selectedMenu ? (
													<div className='text-left'>
														<div className='font-medium'>
															{selectedMenu.name}
														</div>
														<div className='text-xs text-muted-foreground mt-0.5 text-wrap'>
															{selectedMenu.description}
														</div>
													</div>
												) : (
													'Choose a menu...'
												)}
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent className='max-w-lg'>
											<AlertDialogHeader>
												<AlertDialogTitle>Select a Menu</AlertDialogTitle>
												<AlertDialogDescription>
													Choose a menu for your event. This determines the food
													and drinks that will be served.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<div className='grid gap-2 max-h-72 overflow-y-auto py-2'>
												{menus.length === 0 ? (
													<p className='text-sm text-muted-foreground text-center py-4'>
														No menus available. Please create one first.
													</p>
												) : (
													menus.map((menu) => {
														const isSelected = field.state.value === menu.id;
														return (
															<button
																key={menu.id}
																type='button'
																onClick={() => {
																	field.handleChange(menu.id);
																	setDialogOpen(false);
																}}
																className={cn(
																	'flex items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent',
																	isSelected && 'border-primary bg-primary/5',
																)}
															>
																<div className='flex-1 min-w-0'>
																	<div className='font-medium text-sm'>
																		{menu.name}
																	</div>
																	<div className='text-xs text-muted-foreground mt-0.5 line-clamp-2'>
																		{menu.description}
																	</div>
																</div>
																{isSelected && (
																	<Check className='size-4 text-primary shrink-0 mt-0.5' />
																)}
															</button>
														);
													})
												)}
											</div>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
									<FieldError errors={field.state.meta.errors} />
								</FieldContent>
							</Field>
						);
					}}
				</form.AppField>
			</FieldGroup>
		);
	},
});
