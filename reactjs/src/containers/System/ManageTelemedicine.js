import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageTelemedicine.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Header/Header";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { CommonUtils } from "../../utils";
import {
	handleCreateTelemedicine,
	deleteTelemedicine,
	updateTelemedicine,
	getPaginationTelemedicine,
	getTotalRowTelemedicine,
} from "../../services/telemedicineService";
import Pagination from "../../components/Common/Pagination";
import LoadingSpinner from "../../components/Common/Loading";

const mdParser = new MarkdownIt();

class ManageTelemedicine extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			image: "",
			description: "",
			descriptionHTML: "",
			arrTelems: [],
			confirmDelete: false,
			showBtnEdit: false,
			newPage: 1,
			isLoading: false,
		};
	}

	async componentDidMount() {
		await this.getALLTelemedicineReact();
		await this.getTotalRowTelemedicineReact();
	}

	handleOnchangeInput = (event, id) => {
		let stateCopy = { ...this.state };
		stateCopy[id] = event.target.value;
		this.setState({
			...stateCopy,
		});
	};

	handleEditorChange = ({ html, text }) => {
		this.setState({
			descriptionHTML: html,
			description: text,
		});
	};

	handleOnchangeImage = async (event) => {
		let data = event.target.files;
		let file = data[0];
		if (file) {
			let base64 = await CommonUtils.getBase64(file);
			this.setState({
				imageBase64: base64,
			});
		}
	};

	getALLTelemedicineReact = async () => {
		this.setState({
			isLoading: true,
		});
		let res = await getPaginationTelemedicine(this.state.newPage);
		if (res && res.code === 200) {
			this.setState({
				arrTelems: res.data,
				isLoading: false,
			});
		} else {
			this.setState({
				isLoading: false,
			});
		}
	};

	getTotalRowTelemedicineReact = async () => {
		let res = await getTotalRowTelemedicine();
		if (res && res.code === 200) {
			let row = Math.ceil(res.data.totalRow / 5);
			this.setState({
				totalRow: row,
			});
		}
	};

	handlePageChange = async (newPage) => {
		await this.setState({
			newPage: newPage,
		});
		await this.getALLTelemedicineReact();
	};

	handleCreateNewTelemedicine = async () => {
		let infor = {
			name: this.state.name,
			description: this.state.description,
			descriptionHTML: this.state.descriptionHTML,
			image: this.state.imageBase64,
		};
		try {
			let res = await handleCreateTelemedicine(infor);
			if (res && res.code === 200) {
				await this.getALLTelemedicineReact();
				toast.success("Thêm mới thành công!");
				this.setState({
					name: "",
					description: "",
					descriptionHTML: "",
					image: "",
				});
			}
		} catch (error) {
			console.log(error);
			toast.error("Thêm mới thất bại!");
		}
	};

	handleDeleteTelemedicine = async () => {
		try {
			let res = await deleteTelemedicine(this.state.telemedicineId);
			if (res && res.code === 200) {
				await this.getALLTelemedicineReact();
				toast.success("Xóa thành công!");
				this.setState({
					confirmDelete: false,
				});
			}
		} catch (error) {
			console.log(error);
			toast.error("Xóa thất bại!");
		}
	};

	handleEditTelemedicine = async () => {
		let data = {
			name: this.state.name,
			description: this.state.description,
			descriptionHTML: this.state.descriptionHTML,
			image: this.state.imageBase64,
			id: this.state.id,
		};
		try {
			let res = await updateTelemedicine(data);
			if (res && res.code === 200) {
				await this.getALLTelemedicineReact();
				toast.success("Chỉnh sửa thành công!");
				this.setState({
					name: "",
					description: "",
					descriptionHTML: "",
					image: "",
					showBtnEdit: false,
				});
			}
		} catch (error) {
			console.log(error);
			toast.error("Chỉnh sửa thất bại!");
		}
	};

	handleFillDataEdit = (item) => {
		this.setState({
			id: item.id,
			name: item.name,
			description: item.description,
			descriptionHTML: item.descriptionHTML,
			image: item.image,
			showBtnEdit: true,
		});
	};

	handleConfirmDelete = (user) => {
		this.setState({
			confirmDelete: true,
			telemedicineId: user.id,
		});
	};

	handleCloseConfirmDelete() {
		this.setState({
			confirmDelete: false,
		});
	}

	render() {
		const { name, description, confirmDelete, showBtnEdit, isLoading } =
			this.state;
		let arrTelems = this.state.arrTelems;
		return (
			<>
				{this.props.isLoggedIn && <Header />}
				<div className="tele-container">
					<div className="title">Quản lý khám từ xa</div>
					<form>
						<div className="tele-input">
							<div className="tele-name">
								<label htmlFor="name">Tên:</label>
								<input
									type="text"
									value={name}
									onChange={(event) =>
										this.handleOnchangeInput(event, "name")
									}
								/>
							</div>
							<div className="tele-image">
								<label htmlFor="image">Ảnh:</label>
								<input
									id="file-input"
									type="file"
									name="file"
									accept="image/png, image/jpeg"
									onChange={(event) =>
										this.handleOnchangeImage(event, "image")
									}
								/>
							</div>
							{showBtnEdit ? (
								<button
									className="btn-edit-tele"
									type="button"
									onClick={() =>
										this.handleEditTelemedicine()
									}
								>
									Lưu
								</button>
							) : (
								<button
									className="btn-add-new-tele"
									type="button"
									onClick={() =>
										this.handleCreateNewTelemedicine()
									}
								>
									Thêm mới
								</button>
							)}
						</div>

						<div className="description">
							<label htmlFor="">Mô tả:</label>
							<MdEditor
								style={{ height: "300px" }}
								renderHTML={(text) => mdParser.render(text)}
								onChange={this.handleEditorChange}
								value={description}
							/>
						</div>
					</form>
					<table id="customers">
						<tbody>
							<tr>
								<th width="10%" className="text-center">
									Id
								</th>
								<th width="30%" className="text-center">
									Tên
								</th>
								<th width="40%" className="text-center">
									Ảnh
								</th>
								<th width="20%" className="text-center">
									Acts
								</th>
							</tr>

							{arrTelems &&
								arrTelems.map((item, index) => {
									let imageBase64 = new Buffer(
										item.image,
										"base64"
									).toString("binary");
									return (
										<tr
											key={index}
											height="160px"
											className="tele-col"
										>
											<td className="text-center">
												{item.id}
											</td>
											<td>{item.name}</td>
											<td>
												{item.image ? (
													<div
														className="tele-image-table"
														style={{
															backgroundImage: `url(${imageBase64})`,
														}}
													></div>
												) : (
													<div>Null</div>
												)}
											</td>
											<td className="text-center">
												<button
													className="btn-edit"
													onClick={() =>
														this.handleFillDataEdit(
															item
														)
													}
												>
													<i className="fas fa-pencil-alt"></i>
												</button>
												<button
													className="btn-delete"
													onClick={() =>
														this.handleConfirmDelete(
															item
														)
													}
												>
													<i className="fas fa-trash"></i>
												</button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
				<div className="pagination-container">
					<Pagination
						totalPages={this.state.totalRow}
						onPageChange={this.handlePageChange}
					/>
				</div>

				{confirmDelete ? (
					<div className="confirm-delete">
						<div className="confirmation-text">
							Bạn có chắc chắn muốn xóa?
						</div>
						<div className="button-container">
							<button
								className="cancel-button"
								onClick={() => this.handleCloseConfirmDelete()}
							>
								Hủy
							</button>
							<button
								className="confirmation-button"
								onClick={() => this.handleDeleteTelemedicine()}
							>
								Xóa
							</button>
						</div>
					</div>
				) : null}
				{isLoading && <LoadingSpinner />}
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.user.isLoggedIn,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageTelemedicine);
