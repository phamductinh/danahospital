import telemedicineModel from "../models/telemedicineModel";

const getAllTelemedicine = (req, res) => {
	telemedicineModel.getAllTelemedicine((error, results) => {
		if (error) {
			return res.status(500).send({
				code: 500,
				msg: errMsg.failed,
			});
		} else {
			return res.status(200).send({
				code: 200,
				data: results,
			});
		}
	});
};

let getTelemedicineById = (req, res) => {
	let id = req.query.id;
	if (!id) {
		return res.status(400).send({ code: 400, msg: "Missing id!" });
	}
	telemedicineModel.getTelemedicineByIdModel(id, (error, data) => {
		if (error) {
			throw error;
		}
		return res.send({
			code: 200,
			data: data[0],
		});
	});
};

let createTelemedicine = (req, res) => {
	let data = req.body;
	telemedicineModel.createNewTelemedicine(data, (err, results) => {
		if (err) {
			console.log(err);
			return res.status(400).send({
				code: 400,
				msg: "Something wrong !",
			});
		}
		return res.status(200).send({
			code: 200,
			msg: "Create successfully !",
		});
	});
};

let updateTelemedicine = (req, res) => {
	let { name, description, descriptionHTML, image, id } = req.body;
	if (!id) {
		return res.status(400).send({ code: 400, msg: "Missing id!" });
	}
	telemedicineModel.updateTelemedicineModel(
		[name, description, descriptionHTML, image, id],
		(error, results, fields) => {
			if (error) throw error;
			return res.send({
				code: 200,
				msg: "Update successfully!",
			});
		}
	);
};

let deleteTelemedicine = (req, res) => {
	let id = req.query.id;
	if (!id) {
		return res.status(400).send({ code: 400, msg: "Missing id!" });
	}
	telemedicineModel.deleteTelemedicineModel(id, (error, results, fields) => {
		if (error) throw error;
		return res.send({
			code: 200,
			msg: "Delete successfully!",
		});
	});
};

const getTotalRowTelemedicine = (req, res) => {
	telemedicineModel.getTotalRowTelemedicineModel((error, results) => {
		if (error) {
			return res.status(500).send({
				code: 500,
				msg: errMsg.failed,
			});
		} else {
			return res.status(200).send({
				code: 200,
				data: results[0],
			});
		}
	});
};

const getPaginationTelemedicine = (req, res) => {
	let page = req.query.page ? req.query.page : 1;
	let limit = 4;
	let start = (page - 1) * limit;
	telemedicineModel.getPaginationTelemedicineModel(
		start,
		limit,
		(error, results) => {
			if (error) {
				return res.status(500).send({
					code: 500,
					msg: "Failed!",
				});
			} else {
				return res.status(200).send({
					code: 200,
					data: results,
				});
			}
		}
	);
};

module.exports = {
	createTelemedicine,
	getAllTelemedicine,
	deleteTelemedicine,
	updateTelemedicine,
	getTelemedicineById,
	getPaginationTelemedicine,
	getTotalRowTelemedicine,
};
