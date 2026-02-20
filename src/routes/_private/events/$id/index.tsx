import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query';
import {
	createFileRoute,
	getRouteApi,
	Link,
	useRouter,
} from '@tanstack/react-router';
import {
	CalendarDays,
	MapPin,
	Users,
	UtensilsCrossed,
	Pencil,
	Trash2,
	ArrowLeft,
	FileText,
} from 'lucide-react';
import {
	createEventQueryOptions,
	createDeleteEventMutationOptions,
} from '@/lib/events.server';
import { statusVariant } from '@/lib/constants';
import { showToast } from '@/lib/utils';

export const Route = createFileRoute('/_private/events/$id/')({
	component: RouteComponent,
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

	const deleteMutation = useMutation({
		...createDeleteEventMutationOptions(userId, eventId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['events'],
			});
			router.navigate({ to: '/events' });
			showToast(
				'Event deleted',
				'The event has been successfully deleted.',
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
		<section className='px-4 max-w-3xl mx-auto'>
			<Button
				variant='ghost'
				size='sm'
				asChild
				className='mb-4'
			>
				<Link to='/events'>
					<ArrowLeft className='size-4 mr-1' />
					Back to Events
				</Link>
			</Button>

			<Card>
				<CardHeader>
					<div className='flex items-start justify-between gap-2'>
						<div className='min-w-0'>
							<CardTitle className='text-2xl'>{event.name}</CardTitle>
							<CardDescription className='mt-1 capitalize'>
								{event.type}
							</CardDescription>
						</div>
						<Badge
							variant={statusVariant[event.status] ?? 'secondary'}
							className='capitalize shrink-0'
						>
							{event.status}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<dl className='grid gap-4 sm:grid-cols-2'>
						<div className='flex items-center gap-3'>
							<div className='flex size-9 items-center justify-center rounded-md bg-muted'>
								<CalendarDays className='size-4 text-muted-foreground' />
							</div>
							<div>
								<dt className='text-xs text-muted-foreground'>Date</dt>
								<dd className='text-sm font-medium'>
									{new Date(event.date).toLocaleDateString(undefined, {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})}
								</dd>
							</div>
						</div>
						<div className='flex items-center gap-3'>
							<div className='flex size-9 items-center justify-center rounded-md bg-muted'>
								<MapPin className='size-4 text-muted-foreground' />
							</div>
							<div>
								<dt className='text-xs text-muted-foreground'>Location</dt>
								<dd className='text-sm font-medium'>{event.location}</dd>
							</div>
						</div>
						<div className='flex items-center gap-3'>
							<div className='flex size-9 items-center justify-center rounded-md bg-muted'>
								<Users className='size-4 text-muted-foreground' />
							</div>
							<div>
								<dt className='text-xs text-muted-foreground'>Guests</dt>
								<dd className='text-sm font-medium'>
									{event.guestCount}{' '}
									{event.guestCount === 1 ? 'guest' : 'guests'}
								</dd>
							</div>
						</div>
						<div className='flex items-center gap-3'>
							<div className='flex size-9 items-center justify-center rounded-md bg-muted'>
								<UtensilsCrossed className='size-4 text-muted-foreground' />
							</div>
							<div>
								<dt className='text-xs text-muted-foreground'>Menu</dt>
								<dd className='text-sm font-medium'>{event.menu.name}</dd>
							</div>
						</div>
					</dl>
				</CardContent>
			</Card>

			<Card className='mt-6'>
				<CardHeader>
					<div className='flex items-center gap-2'>
						<FileText className='size-5 text-muted-foreground' />
						<CardTitle>Menu Details</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<div className='space-y-2'>
						<div>
							<span className='text-xs text-muted-foreground'>Name</span>
							<p className='text-sm font-medium'>{event.menu.name}</p>
						</div>
						<Separator />
						<div>
							<span className='text-xs text-muted-foreground'>Description</span>
							<p className='text-sm text-muted-foreground'>
								{event.menu.description}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className='flex items-center justify-end gap-3 mt-6 mb-8'>
				<Button
					variant='outline'
					asChild
				>
					<Link
						to={`/events/$id/edit`}
						params={{ id: event.id.toString() }}
					>
						<Pencil className='size-4 mr-2' />
						Edit Event
					</Link>
				</Button>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant='destructive'>
							<Trash2 className='size-4 mr-2' />
							Delete Event
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Event</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete &quot;{event.name}&quot;? This
								action cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								variant='destructive'
								onClick={() => deleteMutation.mutate()}
								disabled={deleteMutation.isPending}
							>
								{deleteMutation.isPending ? 'Deleting...' : 'Delete'}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</section>
	);
}
