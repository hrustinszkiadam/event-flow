import { EventForm } from '@/components/events';
import Loading from '@/components/loading';
import { getSession } from '@/lib/auth.server';
import {
	createCreateEventMutationOptions,
	createMenusQueryOptions,
} from '@/lib/events.server';
import { showToast } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/events/new')({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getSession();

		if (!session) {
			throw new Error('Not authenticated');
		}

		return { session };
	},
	loader: async ({ context }) => {
		const userId = context.session.user.id;
		await context.queryClient.ensureQueryData(createMenusQueryOptions());
		return { userId };
	},
	pendingComponent: Loading,
});

function RouteComponent() {
	const { userId } = Route.useLoaderData();
	const router = useRouter();
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		...createCreateEventMutationOptions(userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['events'] });
			router.navigate({ to: '/events' });
			showToast(
				'Event created',
				'Your event has been successfully created.',
				'success',
			);
		},
	});

	return (
		<section className='px-4'>
			<h2 className='text-2xl font-bold mb-4'>Create a New Event</h2>
			<p className='text-muted-foreground mb-6'>
				Fill in the details below to create your event.
			</p>
			<EventForm
				onSubmit={(values) => createMutation.mutate(values)}
				isPending={createMutation.isPending}
				submitLabel='Create Event'
			/>
		</section>
	);
}
