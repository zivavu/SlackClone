import { getChannels, seedDefaultChannels } from '@/app/api/channels/actions';
import { redirect } from 'next/navigation';

export default async function ClientPage() {
	let channels = await getChannels();
	if (channels.length === 0) {
		await seedDefaultChannels();
		channels = await getChannels();
	}
	const first = channels[0];
	redirect(`/client/${first.id}`);
}
