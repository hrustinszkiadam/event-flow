import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { LogIn, Loader2, Eye, EyeOff } from 'lucide-react';

import { signIn } from '@/lib/auth.server';
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

export const Route = createFileRoute('/auth/login')({
	component: LoginPage,
});

const signInSchema = z.object({
	email: z.email('Please enter a valid email address'),
	password: z.string().min(1, 'Password is required'),
});

function LoginPage() {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const loginMutation = useMutation({
		mutationFn: signIn,
		onSuccess: async () => {
			await router.invalidate();
			router.navigate({ to: '/' });
		},
		onError: (error) => {
			setServerError(error.message ?? 'Invalid email or password');
		},
	});

	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		validators: {
			onSubmit: signInSchema,
		},
		onSubmit: ({ value }) => {
			setServerError(null);
			loginMutation.mutate({ data: value });
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-xl'>Welcome back</CardTitle>
				<CardDescription>Sign in to your account to continue</CardDescription>
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
												autoComplete='current-password'
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

						<Button
							type='submit'
							className='w-full'
							size='lg'
							disabled={loginMutation.isPending}
						>
							{loginMutation.isPending ? (
								<Loader2 className='size-4 animate-spin' />
							) : (
								<LogIn className='size-4' />
							)}
							{loginMutation.isPending ? 'Signing in...' : 'Sign in'}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter className='flex-col gap-4'>
				<Separator />
				<p className='text-center text-sm text-muted-foreground'>
					Don&apos;t have an account?{' '}
					<Link
						to='/auth/register'
						className='font-medium text-primary underline-offset-4 hover:underline'
					>
						Create an account
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
}
