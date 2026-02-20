import Loading from '@/components/loading';
import { getSession } from '@/lib/auth.server';
import { createEventQueryOptions } from '@/lib/events.server';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/events/$id')({
	component: RouteComponent,
	beforeLoad: async ({ params }) => {
		const session = await getSession();

		if (!session) {
			throw new Error('Not authenticated');
		}

		if (!params.id || Number.isNaN(Number(params.id))) {
			throw new Error('Invalid event ID');
		}

		const eventId = Number(params.id);

		return { session, eventId };
	},
	loader: async ({ context }) => {
		const userId = context.session.user.id;
		const eventId = context.eventId;

		await context.queryClient.ensureQueryData(
			createEventQueryOptions(userId, eventId),
		);

		return { userId, eventId };
	},
	pendingComponent: Loading,
	errorComponent: () => {
		return (
			<div className='flex items-center justify-center py-16 text-center'>
				<p className='text-lg text-muted-foreground'>Event not found.</p>
			</div>
		);
	},
});

function RouteComponent() {
	return <Outlet />;
}
