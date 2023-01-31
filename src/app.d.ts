// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { TileType } from '$lib/types';
import type { Model } from 'mongoose';

// and what to do when importing types
declare global {
	namespace App {
		interface Locals {
			TileTypeModel: Model<TileType>;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}
