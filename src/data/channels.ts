export type Channel = {
	id: string;
	name: string;
	topic?: string;
};

export const channels: Channel[] = [
	{
		id: 'b19c8100-9fca-4d76-b9d5-6d53ed43c6f1',
		name: 'general',
		topic: 'Company-wide announcements and work-based matters',
	},
	{
		id: '8b5a2a9f-42bb-41f7-b5f7-5a7b0cb43c5a',
		name: 'random',
		topic: 'Off-topic and watercooler chat',
	},
	{
		id: '1f9c3d2e-0d7b-4d6e-bc48-0c59b0a18a11',
		name: 'announcements',
		topic: 'Release notes and important updates',
	},
	{
		id: '3e87a650-9f21-4e6e-b8cf-7526f951f8e2',
		name: 'design',
		topic: 'Design discussions and reviews',
	},
	{
		id: '6a1f95a1-3adf-46a1-8f7b-3b9fdf4a3e57',
		name: 'engineering',
		topic: 'Engineering topics and code reviews',
	},
];
