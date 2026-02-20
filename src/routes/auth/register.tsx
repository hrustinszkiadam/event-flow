import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';

import { signUp } from '@/lib/auth.server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
	FieldGroup,
} from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import z from 'zod';

export const Route = createFileRoute('/auth/register')({
	component: RegisterPage,
});

const signUpSchema = z
	.object({
		name: z
			.string()
			.min(2, 'Name must be at least 2 characters')
			.max(100, 'Name must be at most 100 characters'),
		email: z.email('Please enter a valid email address'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(128, 'Password must be at most 128 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

function RegisterPage() {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const registerMutation = useMutation({
		mutationFn: signUp,
		onSuccess: async () => {
			await router.invalidate();
			router.navigate({ to: '/' });
		},
		onError: (error) => {
			setServerError(
				error.message ?? 'Something went wrong. Please try again.',
			);
		},
	});

	const form = useForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validators: {
			onSubmit: signUpSchema,
		},
		onSubmit: ({ value }) => {
			setServerError(null);
			registerMutation.mutate({
				data: {
					name: value.name,
					email: value.email,
					password: value.password,
				},
			});
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-xl'>Create an account</CardTitle>
				<CardDescription>Enter your details to get started</CardDescription>
			</CardHeader>

			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						{serverError && (
							<div className='rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive'>
								{serverError}
							</div>
						)}

						<form.Field name='name'>
							{(field) => (
								<Field
									data-invalid={field.state.meta.errors.length > 0 || undefined}
								>
									<FieldLabel htmlFor={field.name}>Name</FieldLabel>
									<FieldContent>
										<Input
											id={field.name}
											type='text'
											placeholder='John Doe'
											autoComplete='name'
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											aria-invalid={field.state.meta.errors.length > 0}
										/>
										<FieldError errors={field.state.meta.errors} />
									</FieldContent>
								</Field>
							)}
						</form.Field>

						<form.Field name='email'>
							{(field) => (
								<Field
									data-invalid={field.state.meta.errors.length > 0 || undefined}
								>
									<FieldLabel htmlFor={field.name}>Email</FieldLabel>
									<FieldContent>
										<Input
											id={field.name}
											type='email'
											placeholder='you@example.com'
											autoComplete='email'
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											aria-invalid={field.state.meta.errors.length > 0}
										/>
										<FieldError errors={field.state.meta.errors} />
									</FieldContent>
								</Field>
							)}
						</form.Field>

						<form.Field name='password'>
							{(field) => (
								<Field
									data-invalid={field.state.meta.errors.length > 0 || undefined}
								>
									<FieldLabel htmlFor={field.name}>Password</FieldLabel>
									<FieldContent>
										<div className='relative'>
											<Input
												id={field.name}
												type={showPassword ? 'text' : 'password'}
												placeholder='••••••••'
												autoComplete='new-password'
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={field.state.meta.errors.length > 0}
											/>
											<Button
												type='button'
												variant='ghost'
												size='icon-xs'
												className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
												onClick={() => setShowPassword((v) => !v)}
												tabIndex={-1}
											>
												{showPassword ? (
													<EyeOff className='size-4' />
												) : (
													<Eye className='size-4' />
												)}
											</Button>
										</div>
										<FieldError errors={field.state.meta.errors} />
									</FieldContent>
								</Field>
							)}
						</form.Field>

						<form.Field name='confirmPassword'>
							{(field) => (
								<Field
									data-invalid={field.state.meta.errors.length > 0 || undefined}
								>
									<FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
									<FieldContent>
										<div className='relative'>
											<Input
												id={field.name}
												type={showConfirmPassword ? 'text' : 'password'}
												placeholder='••••••••'
												autoComplete='new-password'
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={field.state.meta.errors.length > 0}
											/>
											<Button
												type='button'
												variant='ghost'
												size='icon-xs'
												className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
												onClick={() => setShowConfirmPassword((v) => !v)}
												tabIndex={-1}
											>
												{showConfirmPassword ? (
													<EyeOff className='size-4' />
												) : (
													<Eye className='size-4' />
												)}
											</Button>
										</div>
										<FieldError errors={field.state.meta.errors} />
									</FieldContent>
								</Field>
							)}
						</form.Field>

						<Button
							type='submit'
							className='w-full'
							size='lg'
							disabled={registerMutation.isPending}
						>
							{registerMutation.isPending ? (
								<Loader2 className='size-4 animate-spin' />
							) : (
								<UserPlus className='size-4' />
							)}
							{registerMutation.isPending
								? 'Creating account...'
								: 'Create account'}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter className='flex-col gap-4'>
				<Separator />
				<p className='text-center text-sm text-muted-foreground'>
					Already have an account?{' '}
					<Link
						to='/auth/login'
						className='font-medium text-primary underline-offset-4 hover:underline'
					>
						Sign in
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
}
