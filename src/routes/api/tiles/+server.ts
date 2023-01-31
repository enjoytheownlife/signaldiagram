import { TileTypeModel } from '$lib/models';
import { offlineData } from '$lib/db';
import * as dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

dotenv.config();

const env = process.env['ENVIRONMENT'];

export const GET = async () => {
	let resArray: any = [];

	if (env === 'dev') {
		resArray = offlineData;
	}

	if (env === 'prod') {
		// @ts-ignore
		let tiles = await TileTypeModel.find();

		resArray = tiles;
	}

	return new Response(JSON.stringify(resArray), { status: 200 });
};

export const POST = async ({ request }) => {
	const obj = await request.json();

	const newTileType = new TileTypeModel(obj);

	let res = await newTileType.save();

	return new Response(JSON.stringify(res), { status: 200 });
};

export const PATCH = async ({ request }) => {
	const obj = await request.json();

	const objIDRemoved = { ...obj };
	delete objIDRemoved._id;

	const res = await TileTypeModel.updateOne({ _id: new ObjectId(obj._id) }, { $set: objIDRemoved });

	return new Response(JSON.stringify(res), { status: 200 });
};
