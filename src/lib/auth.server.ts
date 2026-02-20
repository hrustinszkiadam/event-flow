import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { auth } from '@/lib/auth';
import z from 'zod';

export const getSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		const session = await auth.api.getSession({
			headers: getRequestHeaders(),
		});

		return session;
	},
);

export const signIn = createServerFn({ method: 'POST' })
	.inputValidator(
		z.object({
			email: z.email('Please enter a valid email address'),
			password: z.string().nonempty('Password is required'),
		}),
	)
	.handler(async ({ data }) => {
		const response = await auth.api.signInEmail({
			body: {
				email: data.email,
				password: data.password,
			},
			headers: getRequestHeaders(),
		});

		return response;
	});

export const signUp = createServerFn({ method: 'POST' })
	.inputValidator(
		z.object({
			name: z.string().nonempty('Name is required'),
			email: z.email('Please enter a valid email address'),
			password: z.string().min(8, 'Password must be at least 8 characters'),
		}),
	)
	.handler(async ({ data }) => {
		const response = await auth.api.signUpEmail({
			body: {
				name: data.name,
				email: data.email,
				password: data.password,
			},
			headers: getRequestHeaders(),
		});

		return response;
	});

export const updateName = createServerFn({ method: 'POST' })
	.inputValidator(
		z.object({
			name: z
				.string()
				.min(2, 'Name must be at least 2 characters')
				.max(100, 'Name must be at most 100 characters'),
		}),
	)
	.handler(async ({ data }) => {
		const response = await auth.api.updateUser({
			body: { name: data.name },
			headers: getRequestHeaders(),
		});

		return response;
	});

export const changePassword = createServerFn({ method: 'POST' })
	.inputValidator(
		z.object({
			currentPassword: z.string().nonempty('Current password is required'),
			newPassword: z
				.string()
				.min(8, 'New password must be at least 8 characters')
				.max(128, 'New password must be at most 128 characters'),
		}),
	)
	.handler(async ({ data }) => {
		const response = await auth.api.changePassword({
			body: {
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				revokeOtherSessions: true,
			},
			headers: getRequestHeaders(),
		});

		return response;
	});
