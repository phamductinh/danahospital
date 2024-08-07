import { findRoomByCode, createRoomQuery } from "../database/queries";
import { errMsg } from "../utils/resMsg";

let getRoomModel = (code, callback) => {
	db.query(findRoomByCode, code, (error, results) => {
		if (error) {
			return callback(error);
		}
		return callback(null, results[0]);
	});
};

let makeRandomString = (length) => {
	let firstString = "";
	let secondString = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		firstString += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}

	for (let i = 0; i < length; i++) {
		secondString += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}

	return `${firstString}-${secondString}`;
};

let createRoomModel = async (roomData, callback) => {
	let code = await makeRandomString(5);
	let status = 1;
	if (!code || !status) {
		let error = new Error(errMsg.missing_input);
		error.statusCode = 400;
		return callback(error);
	}

	db.query(findRoomByCode, code, (err, result) => {
		if (err) {
			return callback(err);
		}

		if (result.length) {
			let error = new Error(errMsg.inUsed);
			error.statusCode = 409;
			return callback(error);
		}

		db.query(createRoomQuery, [code, status], (err, results) => {
			if (err) {
				return callback(err);
			}
			callback(null, results);
		});
	});
};

module.exports = {
	createRoomModel,
	getRoomModel,
};
