import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const URI = process.env['DB_URI'];
const ENV = process.env['ENVIRONMENT'];

/* 
  0 - disconnected
  1 - connected
  2 - connecting
  3 - disconnecting
  4 - uninitialized
*/

mongoose.set('strictQuery', false);

const mongoConnection = {
	isConnected: 0
};

export const dbConnect = async () => {
	console.log('attempting connect');

	if (mongoConnection.isConnected === 1) {
		return;
	}

	if (mongoose.connections.length > 0) {
		mongoConnection.isConnected = mongoose.connections[0].readyState;
		if (mongoConnection.isConnected === 1) {
			console.log('connection exists');
			return;
		}

		await mongoose.disconnect();
	}

	await mongoose.connect(URI, {
		dbName: ENV
	});
	mongoConnection.isConnected = 1;
	console.log('connected to mongo', URI + '/' + ENV);
};

export const dbDisconnect = () => {
	if (process.env['ENVIRONMENT'] === 'dev') return;
	if (mongoConnection.isConnected === 0) return;
	console.log('disconnecting from mongodb....');

	mongoose.disconnect();
	mongoConnection.isConnected = 0;
};
