import { getSession } from '@/lib/auth.server';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import {
	MapPin,
	Users,
	CalendarDays,
	Sparkles,
	UtensilsCrossed,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	createEventsQueryOptions,
	getEventsForUser,
} from '@/lib/events.server';
import { statusVariant } from '@/lib/constants';
import Loading from '@/components/loading';

export const Route = createFileRoute('/_private/events/')({
	component: App,
	beforeLoad: async () => {
		const session = await getSession();

		if (!session) {
			throw new Error('Not authenticated');
		}

		return { session };
	},
	loader: async ({ context }) => {
		const userId = context.session.user.id;
		await context.queryClient.ensureQueryData(createEventsQueryOptions(userId));
		return { userId };
	},
	pendingComponent: Loading,
	errorComponent: ({ error }) => (
		<div className='flex items-center justify-center h-screen'>
			<div className='text-center'>
				<p className='text-lg text-destructive'>Error: {error.message}</p>
			</div>
		</div>
	),
});

function App() {
	const { userId } = Route.useLoaderData();
	const { data: events } = useSuspenseQuery(createEventsQueryOptions(userId));

	return (
		<section className='px-4'>
			<h2 className='text-2xl font-bold mb-4'>My Events</h2>
			<p className='text-muted-foreground'>
				Here you can manage all your events. Create new ones, edit existing
				ones, and keep track of everything in one place.
			</p>
			<hr className='my-4' />
			{events.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-16 text-center'>
					<Sparkles className='size-10 text-muted-foreground mb-4' />
					<p className='text-lg font-medium'>No events yet</p>
					<p className='text-sm text-muted-foreground mt-1'>
						Create your first event to get started.
					</p>
				</div>
			) : (
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8'>
					{events.map((event) => (
						<EventCard
							key={event.id}
							event={event}
						/>
					))}
				</div>
			)}
			<div className='flex items-center justify-center'>
				<Button
					size='lg'
					asChild
				>
					<Link to='/events/new'>Create an Event</Link>
				</Button>
			</div>
		</section>
	);
}

type EventWithMenu = Awaited<ReturnType<typeof getEventsForUser>>[number];

function EventCard({ event }: { event: EventWithMenu }) {
	const router = useRouter();
	return (
		<Card
			className='transition-colors hover:bg-popover/50 cursor-pointer hover:border hover:border-primary'
			onClick={() => {
				router.navigate({
					to: `/events/${event.id}`,
				});
			}}
		>
			<CardHeader>
				<div className='flex items-start justify-between gap-2'>
					<div className='min-w-0'>
						<CardTitle className='truncate'>{event.name}</CardTitle>
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
				<dl className='grid gap-2.5 text-sm'>
					<div className='flex items-center gap-2 text-muted-foreground'>
						<CalendarDays className='size-4 shrink-0' />
						<dd>
							{new Date(event.date).toLocaleDateString(undefined, {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</dd>
					</div>
					<div className='flex items-center gap-2 text-muted-foreground'>
						<MapPin className='size-4 shrink-0' />
						<dd className='truncate'>{event.location}</dd>
					</div>
					<div className='flex items-center gap-2 text-muted-foreground'>
						<Users className='size-4 shrink-0' />
						<dd>
							{event.guestCount} {event.guestCount === 1 ? 'guest' : 'guests'}
						</dd>
					</div>
					<div className='flex items-center gap-2 text-muted-foreground'>
						<UtensilsCrossed className='size-4 shrink-0' />
						<dd className='truncate'>{event.menu.name}</dd>
					</div>
				</dl>
			</CardContent>
		</Card>
	);
}
