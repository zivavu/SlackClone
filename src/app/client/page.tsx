import { channels } from '@/data/channels';
import { redirect } from 'next/navigation';

export default function ClientPage() {
	const first = channels[0];
	if (first) {
		redirect(`/client/${first.id}`);
	}
	return null;
}
