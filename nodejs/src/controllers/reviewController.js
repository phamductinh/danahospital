import { get } from "http";
import db from "../configs/connectDB";
import reviewModel from "../models/reviewModel";
import { errMsg, successMsg } from "../utils/resMsg";

const getTotalRowReview = (req, res) => {
	reviewModel.getTotalRowReviewModel((error, results) => {
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

const getPaginationReviews = (req, res) => {
	let doctorId = req.query.doctorId;
	let page = req.query.page ? req.query.page : 1;
	let limit = 4;
	let start = (page - 1) * limit;
	reviewModel.getPaginationReviewModel(
		doctorId,
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

let deleteReview = (req, res) => {
	let id = req.query.id;
	if (!id) {
		return res.status(400).send({ code: 400, msg: "Missing id!" });
	}
	reviewModel.deleteReviewModel(id, (error, results, fields) => {
		if (error) throw error;
		return res.send({
			code: 200,
			msg: "Delete successfully!",
		});
	});
};

let createAFeedback = (req, res) => {
	let data = req.body;
	reviewModel.createAFeedbackModel(data, (err, results) => {
		if (err) {
			console.log(err);
			return res.status(400).send({
				code: 400,
				msg: "Something wrong!",
			});
		}
		return res.status(200).send({
			code: 200,
			msg: "Create feedback successfully!",
		});
	});
};

let getFeedbackByDoctorId = (req, res) => {
	let doctorId = req.query.doctorId;

	reviewModel.getFeedbackByDoctorIdModel(doctorId, (error, results) => {
		if (error) {
			return res.status(500).send({
				code: 500,
				msg: "Có gì đó sai sai!",
			});
		} else {
			return res.status(200).send({
				code: 200,
				data: results,
			});
		}
	});
};

let updateFeedback = (req, res) => {
	let data = req.body;
	reviewModel.updateFeedbackModel(data, (error, results, fields) => {
		if (error) throw error;
		return res.send({
			code: 200,
			msg: "Update successfully!",
		});
	});
};

module.exports = {
	getTotalRowReview,
	getPaginationReviews,
	deleteReview,
	createAFeedback,
	getFeedbackByDoctorId,
	updateFeedback,
};
