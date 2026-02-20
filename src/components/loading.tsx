import { Loader2 } from 'lucide-react';

export default function Loading({ text }: { text?: string }) {
	return (
		<div className='flex items-center justify-center h-screen'>
			<div className='text-center'>
				<Loader2
					className='animate-spin mx-auto mb-4'
					size={48}
				/>
				<p className='text-lg'>{text ?? 'Loading...'}</p>
			</div>
		</div>
	);
}
