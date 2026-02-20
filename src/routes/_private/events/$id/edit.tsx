import { EventForm } from '@/components/events';
import {
	createEventQueryOptions,
	createMenusQueryOptions,
	createUpdateEventMutationOptions,
} from '@/lib/events.server';
import { showToast } from '@/lib/utils';
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query';
import {
	createFileRoute,
	getRouteApi,
	useRouter,
} from '@tanstack/react-router';

export const Route = createFileRoute('/_private/events/$id/edit')({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(createMenusQueryOptions());
	},
});

function RouteComponent() {
	const { userId, eventId } = getRouteApi(
		'/_private/events/$id',
	).useLoaderData();
	const { data: event } = useSuspenseQuery(
		createEventQueryOptions(userId, eventId),
	);
	const router = useRouter();
	const queryClient = useQueryClient();

	const updateMutation = useMutation({
		...createUpdateEventMutationOptions(userId, eventId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['events'] });
			queryClient.invalidateQueries({
				queryKey: ['event', userId, eventId],
			});
			router.navigate({ to: `/events/$id`, params: { id: String(eventId) } });
			showToast(
				'Event updated',
				'Your event has been successfully updated.',
				'success',
			);
		},
	});

	if (!event) {
		return (
			<div className='flex items-center justify-center py-16 text-center'>
				<p className='text-lg text-muted-foreground'>Event not found.</p>
			</div>
		);
	}

	return (
		<section className='px-4'>
			<h2 className='text-2xl font-bold mb-4'>Edit Event</h2>
			<p className='text-muted-foreground mb-6'>
				Update the details for &quot;{event.name}&quot;.
			</p>
			<EventForm
				defaultValues={{
					name: event.name,
					type: event.type,
					location: event.location,
					guestCount: event.guestCount,
					date: new Date(event.date).toISOString().split('T')[0],
					status: event.status,
					menuId: event.menuId,
				}}
				onSubmit={(values) => updateMutation.mutate(values)}
				isPending={updateMutation.isPending}
				submitLabel='Update Event'
			/>
		</section>
	);
}
