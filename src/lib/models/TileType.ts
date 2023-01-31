import mongoose from 'mongoose';

export interface TileType {
	make: string;
	model: string;
	pixelWidth: number;
	pixelHeight: number;
	mmWidth: number;
	mmHeight: number;
	isApproved: boolean;
	key?: string;
}

const TileTypeSchema = new mongoose.Schema({
	make: String,
	model: String,
	pixelWidth: Number,
	pixelHeight: Number,
	mmWidth: Number,
	mmHeight: Number,
	isApproved: {
		type: Boolean,
		default: false,
		required: true
	},
	key: {
		type: String,
		required: false
	}
});

export const TileTypeModel =
	mongoose.models.Tile_Types || mongoose.model('Tile_Type', TileTypeSchema);
