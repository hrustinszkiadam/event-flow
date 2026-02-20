import { createFileRoute, Link } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import {
	Save,
	Loader2,
	Eye,
	EyeOff,
	KeyRound,
	UserPen,
	ArrowLeft,
} from 'lucide-react';
import z from 'zod';

import { getSession, updateName, changePassword } from '@/lib/auth.server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
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
import { showToast } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/_private/profile')({
	component: ProfilePage,
	beforeLoad: async () => {
		const session = await getSession();

		if (!session) {
			throw new Error('Not authenticated');
		}

		return { session };
	},
	loader: ({ context }) => {
		return {
			user: context.session.user,
		};
	},
});

const nameSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(100, 'Name must be at most 100 characters'),
});

const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Current password is required'),
		newPassword: z
			.string()
			.min(8, 'New password must be at least 8 characters')
			.max(128, 'New password must be at most 128 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your new password'),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

function ProfilePage() {
	return (
		<section className='px-4'>
			<h2 className='text-2xl font-bold mb-4'>Profile</h2>
			<p className='text-muted-foreground'>
				Manage your account settings and change your password.
			</p>
			<hr className='my-4' />
			<div className='flex flex-col mx-auto gap-4 container max-w-7xl'>
				<Button
					variant='ghost'
					size='sm'
					asChild
					className='mb-4 self-start'
				>
					<Link to='/events'>
						<ArrowLeft className='size-4 mr-1' />
						Back to Events
					</Link>
				</Button>
				<div className='flex flex-col lg:flex-row justify-center gap-4 flex-wrap grow w-full'>
					<NameCard />
					<PasswordCard />
				</div>
			</div>
		</section>
	);
}

function NameCard() {
	const {
		refetch,
		isRefetching,
		data: session,
		isPending,
	} = authClient.useSession();

	const nameMutation = useMutation({
		mutationFn: updateName,
		onSuccess: () => {
			showToast(
				'Name updated',
				'Your display name has been successfully updated.',
				'success',
			);
			refetch();
		},
		onError: (error) => {
			showToast('Error', error.message ?? 'Failed to update name', 'error');
		},
	});

	const form = useForm({
		defaultValues: {
			name: session?.user?.name ?? '',
		},
		validators: {
			onSubmit: nameSchema,
		},
		onSubmit: ({ value }) => {
			nameMutation.mutate({ data: value });
		},
	});

	if (isPending) {
		return (
			<Card className='grow'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-xl'>
						<UserPen className='size-5' />
						Display Name
					</CardTitle>
					<CardDescription>Change your public display name.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center justify-center py-16'>
						<Loader2 className='size-6 animate-spin text-muted-foreground' />
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='grow'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 text-xl'>
					<UserPen className='size-5' />
					Display Name
				</CardTitle>
				<CardDescription>Change your public display name.</CardDescription>
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
											placeholder='Your name'
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

						<Button
							type='submit'
							size='lg'
							disabled={nameMutation.isPending || isRefetching}
							className='w-full sm:w-auto'
						>
							{nameMutation.isPending ? (
								<Loader2 className='size-4 animate-spin' />
							) : (
								<Save className='size-4' />
							)}
							{nameMutation.isPending ? 'Saving...' : 'Save name'}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}

function PasswordCard() {
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const passwordMutation = useMutation({
		mutationFn: changePassword,
		onSuccess: () => {
			showToast(
				'Password changed',
				'Your password has been successfully updated.',
				'success',
			);
		},
		onError: (error) => {
			showToast(
				'Error',
				error.message ?? 'Failed to change password. Please try again.',
				'error',
			);
		},
	});

	const form = useForm({
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
		validators: {
			onSubmit: passwordSchema,
		},
		onSubmit: ({ value }) => {
			passwordMutation.mutate({
				data: {
					currentPassword: value.currentPassword,
					newPassword: value.newPassword,
				},
			});
		},
	});

	return (
		<Card className='grow'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 text-xl'>
					<KeyRound className='size-5' />
					Change Password
				</CardTitle>
				<CardDescription>
					Update your password to keep your account secure.
				</CardDescription>
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
						<form.Field name='currentPassword'>
							{(field) => (
								<Field
									data-invalid={field.state.meta.errors.length > 0 || undefined}
								>
									<FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
									<FieldContent>
										<div className='relative'>
											<Input
												id={field.name}
												type={showCurrent ? 'text' : 'password'}
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
												onClick={() => setShowCurrent((v) => !v)}
												tabIndex={-1}
											>
												{showCurrent ? (
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

						<form.Field name='newPassword'>
							{(field) => (
								<Field
									data-invalid={field.state.meta.errors.length > 0 || undefined}
								>
									<FieldLabel htmlFor={field.name}>New Password</FieldLabel>
									<FieldContent>
										<div className='relative'>
											<Input
												id={field.name}
												type={showNew ? 'text' : 'password'}
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
												onClick={() => setShowNew((v) => !v)}
												tabIndex={-1}
											>
												{showNew ? (
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
									<FieldLabel htmlFor={field.name}>
										Confirm New Password
									</FieldLabel>
									<FieldContent>
										<div className='relative'>
											<Input
												id={field.name}
												type={showConfirm ? 'text' : 'password'}
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
												onClick={() => setShowConfirm((v) => !v)}
												tabIndex={-1}
											>
												{showConfirm ? (
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
							size='lg'
							disabled={passwordMutation.isPending}
							className='w-full sm:w-auto'
						>
							{passwordMutation.isPending ? (
								<Loader2 className='size-4 animate-spin' />
							) : (
								<KeyRound className='size-4' />
							)}
							{passwordMutation.isPending
								? 'Changing password...'
								: 'Change password'}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
