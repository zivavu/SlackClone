export type Status = 'online' | 'offline';

export type Message = {
	_id: string;
	authorName: string;
	authorId: string;
	content: string;
	mentions?: string[];
	createdAt: string;
	updatedAt?: string;
};

export type DirectMessageUser = {
	id: string;
	name: string;
	status: Status;
	image?: string;
};
