import { authClient } from '@/lib/auth-client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { Button } from './ui/button';
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from './ui/button';
import type React from 'react';

interface LogoutButtonProps {
	variant?: VariantProps<typeof buttonVariants>['variant'];
	className?: string;
	icon?: React.ReactNode;
}

export default function LogoutButton({
	variant = 'outline',
	className,
	icon,
}: LogoutButtonProps) {
	const router = useRouter();
	const { mutate: logout, isPending } = useMutation({
		mutationFn: () => authClient.signOut(),
		onSuccess: async () => {
			await router.invalidate();
			router.navigate({ to: '/auth/login' });
		},
	});

	return (
		<Button
			variant={variant}
			className={className}
			onClick={() => logout()}
			disabled={isPending}
		>
			{icon}
			{isPending ? 'Logging out...' : 'Logout'}
		</Button>
	);
}
