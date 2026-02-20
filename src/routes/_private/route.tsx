import LogoutButton from '@/components/logout-button';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authMiddleware } from '@/middleware/auth';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { Menu, Home, User, LogOut } from 'lucide-react';

export const Route = createFileRoute('/_private')({
	component: RouteComponent,
	server: {
		middleware: [authMiddleware],
	},
});

function RouteComponent() {
	return (
		<>
			<header className='flex justify-between items-center w-full container p-4 md:py-4 md:px-0 mb-4'>
				<h1 className='text-3xl font-bold text-nowrap'>Event Flow</h1>

				<nav className='hidden md:flex gap-4'>
					<NavLinks />
				</nav>

				<div className='md:hidden'>
					<MobileNav />
				</div>
			</header>
			<main className='container grow '>
				<Outlet />
			</main>
		</>
	);
}

function NavLinks() {
	return (
		<>
			<Button
				variant='link'
				asChild
			>
				<Link
					to='/events'
					activeProps={{ className: 'underline font-semibold' }}
				>
					Events
				</Link>
			</Button>
			<Button
				variant='link'
				asChild
			>
				<Link
					to='/profile'
					activeProps={{ className: 'underline font-semibold' }}
				>
					Profile
				</Link>
			</Button>
			<LogoutButton />
		</>
	);
}

function MobileNav() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size='icon-lg'
				>
					<Menu className='size-5' />
					<span className='sr-only'>Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem asChild>
					<Link
						to='/'
						activeOptions={{ exact: true }}
					>
						<Home className='size-4' />
						Home
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link to='/auth/login'>
						<User className='size-4' />
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<LogoutButton
						variant='ghost'
						className='w-full justify-start px-2 py-1.5 h-auto font-normal'
						icon={<LogOut className='size-4' />}
					/>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
