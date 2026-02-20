import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { auth } from '@/lib/auth';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const session = await auth.api.getSession({
		headers: getRequestHeaders(),
	});

	if (!session) {
		throw redirect({ to: '/auth/login' });
	}

	return await next();
});

export const guestMiddleware = createMiddleware().server(async ({ next }) => {
	const session = await auth.api.getSession({
		headers: getRequestHeaders(),
	});

	if (session) {
		throw redirect({ to: '/' });
	}

	return await next();
});
