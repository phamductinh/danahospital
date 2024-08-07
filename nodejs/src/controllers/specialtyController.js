import db from "../configs/connectDB";
import specialtyModel from "../models/specialtyModel";

const getAllSpecialty = (req, res) => {
	specialtyModel.getAllSpecialtyModel((error, results) => {
		if (error) {
			return res.status(500).send({
				code: 500,
				msg: "Error fetch data !",
			});
		} else {
			return res.status(200).send({
				code: 200,
				data: results,
			});
		}
	});
};

const getTotalRowSpecialty = (req, res) => {
	specialtyModel.getTotalRowSpecialtyModel((error, results) => {
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

const getPaginationSpecialty = (req, res) => {
	let page = req.query.page ? req.query.page : 1;
	let limit = 4;
	let start = (page - 1) * limit;
	specialtyModel.getPaginationSpecialtyModel(
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

let createSpecialty = (req, res) => {
	let data = req.body;
	specialtyModel.createNewSpecialtyModel(data, (err, results) => {
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

let updateSpecialty = (req, res) => {
	let { name, description, descriptionHTML, image, id } = req.body;
	if (!id) {
		return res.status(400).send({ code: 400, msg: "Missing id!" });
	}
	specialtyModel.updateSpecialtyModel(
		[name, description, descriptionHTML, image, id],
		(error, results, fields) => {
			if (error) throw error;
			console.log(error);
			return res.send({
				code: 200,
				msg: "Update successfully!",
			});
		}
	);
};

let deleteSpecialty = (req, res) => {
	let id = req.query.id;
	if (!id) {
		return res.status(400).send({ code: 400, msg: "Missing id!" });
	}
	specialtyModel.deleteSpecialtyModel(id, (error, results, fields) => {
		if (error) throw error;
		return res.send({
			code: 200,
			msg: "Delete successfully!",
		});
	});
};

let getSpecialtyById = (req, res) => {
	let id = req.query.id;
	if (!id) {
		return res.status(400).send({ code: 400, msg: errMsg.missing_input });
	}
	specialtyModel.getSpecialtyByIdModel(id, (error, doctor) => {
		if (error) {
			throw error;
		}
		return res.send({
			code: 200,
			data: doctor[0],
		});
	});
};

module.exports = {
	createSpecialty,
	getAllSpecialty,
	deleteSpecialty,
	updateSpecialty,
	getTotalRowSpecialty,
	getPaginationSpecialty,
	getSpecialtyById,
};
