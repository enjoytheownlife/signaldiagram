import type { Handle, HandleServerError } from '@sveltejs/kit';
import { dbConnect, dbDisconnect } from '$lib/db';
import { TileTypeModel } from '$lib/models';
import type { Model } from 'mongoose';
import type { TileType } from '$lib/types';

if (process.env['ENVIRONMENT'] === 'dev') {
	console.log('dev mode');
}

if (process.env['ENVIRONMENT'] === 'prod') {
	dbConnect();
	console.log('prod mode');
}

const cleanUpServer = (eventType: string) => {
	dbDisconnect();
	console.log(`Received ${eventType} event. Cleaning up server...`);
};

// [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
// 	process.on(eventType, cleanUpServer.bind(null, eventType));
// });

export const handle: Handle = async ({ event, resolve }) => {
	!event.locals.TileTypeModel && (event.locals.TileTypeModel = TileTypeModel as Model<TileType>);
	let init = [TileTypeModel];
	return await resolve(event);
};

export const handleError: HandleServerError = ({ error, event }) => {
	const err = error as Error;
	console.error(err.stack);
	return {
		message: err.message,
		stack: err.stack
	};
};
