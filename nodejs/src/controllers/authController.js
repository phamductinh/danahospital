import db from "../configs/connectDB";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
require("dotenv").config();
const secretKey = process.env.SECRET_TOKEN_KEY;
import emailService from "../services/emailService";
import e from "express";

let register = (req, res, next) => {
	db.query(
		`SELECT * FROM user WHERE LOWER(email) = LOWER(${db.escape(
			req.body.email
		)});`,
		(err, result) => {
			if (result.length) {
				return res.status(409).send({
					code: 409,
					msg: "This user is already in use!",
				});
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(400).send({
							msg: err,
							code: 400,
						});
					} else {
						db.query(
							`INSERT INTO user (email, password) VALUES (${db.escape(
								req.body.email
							)}, ${db.escape(hash)})`,
							(err, result) => {
								if (err) {
									throw err;
								}
								return res.status(201).send({
									code: 201,
									msg: "The user has been registerd !",
								});
							}
						);
					}
				});
			}
		}
	);
};

let login = async (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	if (!email || !password) {
		return res.status(500).send({
			code: 500,
			msg: "Missing email or password!",
		});
	}
	await db.query(
		`SELECT * FROM user WHERE email = ${db.escape(email)};`,
		(err, result) => {
			if (err) {
				throw err;
			}
			if (!result.length) {
				return res.status(400).send({
					code: 400,
					msg: "Incorrect email!",
				});
			}
			// check password
			bcrypt.compare(password, result[0]["password"], (bErr, bResult) => {
				// wrong password
				if (bErr) {
					throw bErr;
				}
				if (bResult) {
					let token = jwt.sign(
						{
							id: result[0].id,
							fullName: result[0].fullName,
							address: result[0].address,
							gender: result[0].gender,
							role: result[0].role,
							phoneNumber: result[0].phoneNumber,
						},
						secretKey,
						{
							expiresIn: "1d",
						}
					);
					delete result[0].password;
					return res.status(200).send({
						code: 200,
						msg: "Logged in!",
						token,
						user: result[0],
					});
				}
				return res.status(401).send({
					code: 401,
					msg: "Email or password is incorrect!",
				});
			});
		}
	);
};

let changePassword = async (req, res) => {
	let password = req.body.password;
	let userId = req.body.id;
	if (!password || !userId) {
		return res.status(500).send({
			code: 500,
			msg: "Missing password!",
		});
	}
	bcrypt.hash(password, 10, (err, hash) => {
		if (err) {
			return res.status(400).send({
				msg: err,
				code: 400,
			});
		} else {
			db.query(
				`UPDATE user SET password = ${db.escape(
					hash
				)} WHERE id = ${userId}`,
				(err, result) => {
					if (err) {
						throw err;
					}
					return res.status(200).send({
						code: 200,
						msg: "Đổi mật khẩu thành công!",
					});
				}
			);
		}
	});
};

let resetPassword = async (req, res) => {
	let password = req.body.password;
	let email = req.body.email;
	if (!password || !email) {
		return res.status(500).send({
			code: 500,
			msg: "Missing password!",
		});
	}
	bcrypt.hash(password, 10, (err, hash) => {
		if (err) {
			return res.status(400).send({
				msg: err,
				code: 400,
			});
		} else {
			db.query(
				`UPDATE user SET password = ${db.escape(
					hash
				)} WHERE email = '${email}'`,
				(err, result) => {
					if (err) {
						throw err;
					}
					return res.status(200).send({
						code: 200,
						msg: "Đổi mật khẩu thành công!",
					});
				}
			);
		}
	});
};

let sendResetPasswordEmail = async (req, res) => {
	let email = req.query.email;
	if (!email) {
		return res.status(500).send({
			code: 500,
			msg: "Missing email!",
		});
	}
	db.query(
		`SELECT * FROM user WHERE email = "${email}"`,
		async (err, result) => {
			if (err) {
				throw err;
			}
			await emailService.sendEmailResetPassword({
				receiverEmail: email,
				fullName: result[0].fullName,
			});
			return res.status(200).send({
				code: 200,
				msg: "Gửi email xác nhận thành công!",
			});
		}
	);
};

module.exports = {
	login,
	register,
	changePassword,
	sendResetPasswordEmail,
	resetPassword,
};
