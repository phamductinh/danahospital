import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageBooking.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../Header/Header";
import LoadingSpinner from "../../../components/Common/Loading";
import {
	confirmBooking,
	deleteBooking,
	getBookingByDate,
} from "../../../services/bookingService";

class ManageBooking extends Component {
	constructor(props) {
		super(props);
		this.state = {
			arrBooking: [],
			isLoading: false,
			confirmDelete: false,
		};
	}

	async componentDidMount() {}

	handleDeleteUser = async () => {
		try {
			this.setState({
				isLoading: true,
			});
			let res = await deleteBooking(this.state.bookingId);
			if (res && res.code === 200) {
				toast.success("Xóa thành công!");
				await getBookingByDate(this.state.formatedDate);
				this.setState({
					confirmDelete: false,
					isLoading: false,
				});
			}
		} catch (error) {
			console.log(error);
			toast.error("Xóa thất bại!");
		}
	};

	handleConfirmBooking = async (item) => {
		try {
			let res = await confirmBooking(item.id);
			if (res && res.code === 200) {
				toast.success("Xác nhận thành công!");
				await getBookingByDate(this.state.formatedDate);
			}
		} catch (error) {
			console.log(error);
			toast.error("Xác nhận thất bại!");
		}
	};

	handleOnchangeInput = async (event) => {
		let date = event.target.value;
		let formatedDate = new Date(date).getTime();
		this.setState({
			formatedDate: formatedDate,
		});
		let res = await getBookingByDate(formatedDate);
		if (res && res.code === 200) {
			this.setState({
				arrBooking: res.data,
			});
		}
	};

	handleConfirmDelete = (item) => {
		this.setState({
			confirmDelete: true,
			bookingId: item.id,
		});
	};

	handleCloseConfirmDelete() {
		this.setState({
			confirmDelete: false,
		});
	}

	render() {
		let { isLoading, confirmDelete, arrBooking } = this.state;
		let currentDate = new Date().toISOString().split("T")[0];

		return (
			<>
				{this.props.isLoggedIn && <Header />}
				<div className="user-container">
					<div className="title text-center">Quản lý đặt lịch</div>
					<div className="mx-3">
						<input
							className="date-choose"
							type="date"
							min={currentDate}
							onChange={(event) =>
								this.handleOnchangeInput(event)
							}
						/>
					</div>
					<div className="users-table mt-3 mx-3">
						<table id="customers">
							<tbody>
								<tr>
									<th width="8%" className="text-center">
										Thời gian
									</th>
									<th width="15%" className="text-center">
										Họ và tên
									</th>
									<th width="15%" className="text-center">
										Địa chỉ
									</th>
									<th width="5%" className="text-center">
										Giới tính
									</th>
									<th width="7%" className="text-center">
										Ngày sinh
									</th>
									<th width="10%" className="text-center">
										Số điện thoại
									</th>
									<th width="15%" className="text-center">
										Lý do
									</th>
									<th width="10%" className="text-center">
										Trạng thái
									</th>
									<th width="15%" className="text-center">
										Acts
									</th>
								</tr>

								{arrBooking &&
									arrBooking.map((item, index) => {
										return (
											<tr key={index}>
												<td>{item.booking_time}</td>
												<td>{item.fullName}</td>
												<td>{item.address}</td>
												<td>{item.gender}</td>
												<td>{item.birthday}</td>
												<td>{item.phoneNumber}</td>
												<td>{item.reason}</td>
												<td>{item.status}</td>
												<td className="text-center">
													<button
														className="btn-confirm"
														onClick={() =>
															this.handleConfirmBooking(
																item
															)
														}
													>
														Xác nhận
													</button>
													<button
														className="btn-refuse"
														onClick={() =>
															this.handleConfirmDelete(
																item
															)
														}
													>
														Từ chối
													</button>
												</td>
											</tr>
										);
									})}
							</tbody>
						</table>
					</div>

					{confirmDelete ? (
						<div className="confirm-delete">
							<div className="confirmation-text">
								Bạn muốn từ chối lịch hẹn này?
							</div>
							<div className="button-container">
								<button
									className="cancel-button"
									onClick={() =>
										this.handleCloseConfirmDelete()
									}
								>
									Hủy
								</button>
								<button
									className="confirmation-button"
									onClick={() => this.handleDeleteUser()}
								>
									Từ chối
								</button>
							</div>
						</div>
					) : null}

					{isLoading && <LoadingSpinner />}
				</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageBooking);
