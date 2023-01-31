import { fail } from '@sveltejs/kit';

import { z } from 'zod';

import * as dotenv from 'dotenv';

dotenv.config();

const registerSchema = z.object({
	make: z.string({ required_error: 'Make is required' }).trim().min(1),
	model: z.string({ required_error: 'Model is required' }).trim().min(1),
	pixelWidth: z.number({ required_error: 'Pixel Width is required' }).min(1),
	pixelHeight: z.number({ required_error: 'Pixel Height is required' }).min(1),
	mmWidth: z.number({ required_error: 'Tile Width is required' }).min(1),
	mmHeight: z.number({ required_error: 'Tile Height is required' }).min(1),
	isApproved: z.boolean()
});

const checkKey = (key: string) => {
	const keyString = process.env['ADD_PANEL_KEYS'];
	const keyArray = keyString?.split(',');

	if (key === '') {
		return false;
	}

	if (keyArray?.includes(key)) {
		return true;
	} else {
		return false;
	}
};

const updateTile = async (dataObj, fetch) => {
	dataObj.isApproved = true;
	let res = await fetch('../api/tiles', {
		method: 'PATCH',
		body: JSON.stringify(dataObj),
		headers: {
			'content-type': 'application/json'
		}
	});

	return res;
};

const createNewTile = async (dataObj, fetch) => {
	let res = await fetch('../api/tiles', {
		method: 'POST',
		body: JSON.stringify(dataObj),
		headers: {
			'content-type': 'application/json'
		}
	});

	return res;
};

export const actions = {
	default: async ({ cookies, request, fetch }) => {
		let res;

		const data = await request.formData();

		let dataObj = Object.fromEntries(data);

		dataObj.pixelHeight = +dataObj.pixelHeight;
		dataObj.pixelWidth = +dataObj.pixelWidth;
		dataObj.mmHeight = +dataObj.mmHeight;
		dataObj.mmWidth = +dataObj.mmWidth;
		dataObj.isApproved = false;

		let result;

		try {
			result = registerSchema.parse(dataObj);
		} catch (err) {
			const { fieldErrors: errors } = err.flatten();

			return fail(401, {
				data: dataObj,
				errors
			});
		}

		let keyIsValid = checkKey(data.get('key'));

		if (dataObj._id) {
			if (!keyIsValid) {
				return fail(401);
			}

			let updateObj = { ...result, isApproved: true, _id: dataObj._id };

			res = await updateTile(updateObj, fetch);
		} else {
			delete dataObj._id;

			res = await createNewTile(result, fetch);
		}

		return JSON.stringify(res);
	}
};
