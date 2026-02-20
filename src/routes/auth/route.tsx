import { guestMiddleware } from '@/middleware/auth';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
	component: AuthLayout,
	server: {
		middleware: [guestMiddleware],
	},
});

function AuthLayout() {
	return (
		<>
			<div className='w-full max-w-md px-8 md:p-0'>
				<div className='mb-8 text-center'>
					<h1 className='text-3xl font-bold tracking-tight text-foreground'>
						Event Flow
					</h1>
					<p className='mt-1 text-sm text-muted-foreground'>
						Manage your events effortlessly
					</p>
				</div>
				<Outlet />
			</div>
		</>
	);
}
