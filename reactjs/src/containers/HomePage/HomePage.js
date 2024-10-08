import React, { Component } from "react";
import { connect } from "react-redux";
import { getALLSpecialty } from "../../services/specialtyService";
import "./HomePage.css";
import {
	getAllDoctors,
	getOutstandingDoctors,
	getDoctorByKeyword,
} from "../../services/doctorService";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import * as actions from "../../store/actions/";
import ChatApp from "../ChatApp/ChatApp";
import Telemedicine from "./Telemedicine";
import Specialty from "./Specialty";
import Facility from "./Facility";
import Footer from "./Footer";

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			arrTelems: [],
			arrSpecialty: [],
			arrDoctors: [],
			specialty: "",
			keyword: "",
			isOpenMenu: false,
		};
	}

	async componentDidMount() {
		await this.getALLDoctorReact();
		await this.getALLSpecialtyReact();
	}

	getALLDoctorReact = async () => {
		let res = await getOutstandingDoctors();
		console.log(res);
		if (res && res.code === 200) {
			this.setState({
				arrDoctors: res.data,
			});
		}
	};

	getALLSpecialtyReact = async () => {
		let res = await getALLSpecialty();
		if (res && res.code === 200) {
			this.setState({
				arrSpecialty: res.data,
			});
		}
	};

	handleOnchangeKeyword = async (event) => {
		await this.setState({
			keyword: event.target.value,
		});
	};

	handleOnchangeSelect = async (event) => {
		await this.setState({
			specialtyId: event.target.value,
		});
	};

	async filterDoctors() {
		let { keyword, specialtyId } = this.state;
		if (!keyword && !specialtyId) {
			this.setState({
				arrDoctorFilter: "",
			});
		} else {
			let res = await getDoctorByKeyword(keyword, specialtyId);
			if (res && res.code === 200) {
				this.setState({
					arrDoctorFilter: res.data,
				});
			} else {
				this.setState({
					arrDoctorFilter: "",
				});
			}
		}
	}

	handleOnchangeInput = async (event) => {
		let keyword = event.target.value;
		if (keyword) {
			let res = await getDoctorByKeyword(keyword);
			if (res && res.code === 200) {
				this.setState({
					doctorResults: res.data,
				});
			} else {
				this.setState({
					doctorResults: "",
				});
			}
		} else {
			this.setState({
				doctorResults: "",
			});
		}
	};

	async handleOpenMenu() {
		await this.setState((prevState) => ({
			isOpenMenu: !prevState.isOpenMenu,
		}));
	}

	handleViewDetail = (doctor) => {
		this.props.history.push(`/detail-doctor/${doctor.id}`);
	};

	handleViewDetailService = (id) => {
		this.props.history.push(`/detail-service/${id}`);
	};

	handleViewSpecialties = () => {
		this.props.history.push(`/specialties`);
	};

	handleViewTelemedicines = () => {
		this.props.history.push(`/telemedicines`);
	};

	handleViewDoctors = () => {
		this.props.history.push(`/doctors`);
	};

	handleViewServices = () => {
		this.props.history.push(`/services`);
	};

	handleViewUpdateInfor = () => {
		if (this.props.userInfor) {
			this.props.history.push(`/update-infor/${this.props.userInfor.id}`);
		}
	};

	handleViewBookingHistory = () => {
		if (this.props.userInfor) {
			this.props.history.push(
				`/booking-history/${this.props.userInfor.id}`
			);
		}
	};

	handleViewChangePassword = () => {
		if (this.props.userInfor) {
			this.props.history.push(
				`/change-password/${this.props.userInfor.id}`
			);
		}
	};

	goToLogin = () => {
		this.props.history.push("/login");
	};

	handleNextDoctor() {
		let lists = document.querySelectorAll(".doctor-slide-item");
		document.getElementById("doctor-slide").appendChild(lists[0]);
	}
	handlePrevDoctor() {
		let lists = document.querySelectorAll(".doctor-slide-item");
		document
			.getElementById("doctor-slide")
			.prepend(lists[lists.length - 1]);
	}

	render() {
		let {
			arrSpecialty,
			arrDoctors,
			arrDoctorFilter,
			isOpenMenu,
			doctorResults,
		} = this.state;
		const { processLogout, userInfor, isLoggedIn } = this.props;
		return (
			<>
				<ChatApp />
				<div className="homepage-container">
					<div id="header" className="header-homepage">
						<div className="home-header">
							<div className="left-content">
								{/* <i className="fas fa-bars"></i> */}
								<div className="header-logo"></div>
							</div>
							<div className="center-content">
								<div
									className="child-content"
									onClick={() => this.handleViewSpecialties()}
								>
									<div>
										<p>Chuyên khoa</p>
									</div>
									<div className="text-under">
										Tìm bác sĩ theo chuyên khoa
									</div>
								</div>
								<div
									className="child-content"
									onClick={() =>
										this.handleViewTelemedicines()
									}
								>
									<div>
										<p>Khám từ xa</p>
									</div>
									<div className="text-under">
										Khám bệnh trực tuyến
									</div>
								</div>
								<div
									className="child-content"
									onClick={() => this.handleViewDoctors()}
								>
									<div>
										<p>Bác sĩ</p>
									</div>
									<div className="text-under">
										Chọn bác sĩ giỏi
									</div>
								</div>
								<div
									className="child-content"
									onClick={() => this.handleViewServices()}
								>
									<div>
										<p>Dịch vụ</p>
									</div>
									<div className="text-under">
										Khám sức khỏe tổng quát
									</div>
								</div>
							</div>
							<div className="right-content">
								<div className="support">
									<i className="far fa-question-circle"></i>
									Hỗ trợ
								</div>
								<div className="flags">
									{/* <div className="flag-vn"></div>
									<div className="flag-en"></div> */}
								</div>
								{!isLoggedIn ? (
									<button
										className="btn-login-header"
										onClick={() => this.goToLogin()}
									>
										<a href="#/">Login</a>
										<div className="arrow-wrapper">
											<div className="arrow"></div>
										</div>
									</button>
								) : (
									<div
										className="user-avatar-header"
										style={{
											backgroundImage: `url(${
												userInfor.image !== null
													? Buffer.from(
															userInfor.image,
															"base64"
													  ).toString("binary")
													: "https://hienthao.com/wp-content/uploads/2023/05/c6e56503cfdd87da299f72dc416023d4-736x620.jpg"
											})`,
										}}
										onClick={() => this.handleOpenMenu()}
									></div>
								)}
								{isOpenMenu && (
									<>
										{isLoggedIn ? (
											<div className="toggle-menu">
												<div className="user-infor">
													<div
														className="user-avatar"
														style={{
															backgroundImage: `url(${
																userInfor.image !==
																null
																	? Buffer.from(
																			userInfor.image,
																			"base64"
																	  ).toString(
																			"binary"
																	  )
																	: "https://hienthao.com/wp-content/uploads/2023/05/c6e56503cfdd87da299f72dc416023d4-736x620.jpg"
															})`,
														}}
													></div>
													<div className="user-name">
														{userInfor.fullName
															? userInfor.fullName
															: "Unknown name"}
													</div>
												</div>
												<div className="update-infor">
													<div
														onClick={() =>
															this.handleViewUpdateInfor()
														}
													>
														Chỉnh sửa thông tin
													</div>
												</div>
												<div className="his-booking">
													<div
														onClick={() =>
															this.handleViewBookingHistory()
														}
													>
														Lịch sử đặt lịch
													</div>
												</div>
												<div className="his-booking">
													<div
														onClick={() =>
															this.handleViewChangePassword()
														}
													>
														Đổi mật khẩu
													</div>
												</div>
												<button
													className="btn-logout"
													onClick={processLogout}
												>
													<i className="fa-solid fa-right-from-bracket"></i>
													Đăng xuất
												</button>
											</div>
										) : null}
									</>
								)}
							</div>
						</div>
					</div>

					<div className="banner-container">
						<div className="home-banner">
							<div className="content-up">
								<div className="overlay">
									<div className="title1">
										<p>NỀN TẢNG Y TẾ</p>
									</div>
									<div className="title2">
										<h1>CHĂM SÓC SỨC KHỎE TOÀN DIỆN</h1>
									</div>
									<div className="search">
										<i className="fas fa-search"></i>
										<input
											type="search"
											placeholder="Tìm bác sĩ"
											onChange={(event) =>
												this.handleOnchangeInput(event)
											}
										/>
										<ul className="doctor-result">
											{doctorResults
												? doctorResults.map((item) => (
														<li
															className="doctor-result-li"
															key={item.id}
															onClick={() =>
																this.handleViewDetail(
																	item
																)
															}
														>
															{item.name}
														</li>
												  ))
												: ""}
										</ul>
									</div>
									<div className="download">
										{/* <div className="android"></div>
										<div className="ios"></div> */}
									</div>
								</div>
							</div>
							<div className="content-down">
								<div className="options">
									<div
										className="option-child"
										onClick={() =>
											this.handleViewDetailService(1)
										}
									>
										<div className="icon-child"></div>
										<div className="text-child">
											Khám
											<br />
											Chuyên khoa
										</div>
									</div>
									<div
										className="option-child"
										onClick={() =>
											this.handleViewDetailService(2)
										}
									>
										<div className="icon-child"></div>
										<div className="text-child">
											Khám
											<br />
											từ xa
										</div>
									</div>
									<div
										className="option-child"
										onClick={() =>
											this.handleViewDetailService(3)
										}
									>
										<div className="icon-child"></div>
										<div className="text-child">
											Xét nghiệm
											<br />y học
										</div>
									</div>
									<div
										className="option-child"
										onClick={() =>
											this.handleViewDetailService(4)
										}
									>
										<div className="icon-child"></div>
										<div className="text-child">
											Sức khỏe
											<br />
											tinh thần
										</div>
									</div>
									<div
										className="option-child"
										onClick={() =>
											this.handleViewDetailService(5)
										}
									>
										<div className="icon-child"></div>
										<div className="text-child">
											Khám
											<br />
											Tổng quát
										</div>
									</div>
								</div>
								<div className="options2">
									<div
										className="option-child"
										onClick={() =>
											this.handleViewDetailService(6)
										}
									>
										<div className="icon-child"></div>
										<div className="text-child">
											Khám
											<br />
											nha khoa
										</div>
									</div>
									<div
										className="option-child"
										onClick={() =>
											this.handleViewDetailService(7)
										}
									>
										<div className="icon-child"></div>
										<div className="text-child">
											Gói
											<br />
											phẫu thuật
										</div>
									</div>
									<div
										className="option-child"
										onClick={() =>
											this.handleViewDetailService(8)
										}
									>
										<div className="icon-child"></div>
										<div className="text-child">
											Sản phẩm
											<br />y tế
										</div>
									</div>
									<div
										className="option-child"
										onClick={() =>
											this.handleViewDetailService(9)
										}
									>
										<div className="icon-child"></div>
										<div className="text-child">
											Sức khỏe
											<br />
											Doanh nghiệp
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* <div className="slider-container">
					<div id="slide">
						<div className="slide-item">
							<div
								className="slide-img"
								style={{
									backgroundImage: "url(./)",
								}}
							></div>
							<div className="slide-content">
								<div className="slide-content-up">
									Giải pháp chuyển đổi số toàn diện cho bệnh
									viện, phòng khám
								</div>
								<div className="slide-content-down">
									<div className="describe">
										<li>
											Mô hình "Nền tảng như một dịch vụ"
											bao gồm Website, ứng dụng di động và
											phần mềm quản trị
										</li>
									</div>
									<a href="#/">Xem chi tiết</a>
								</div>
							</div>
						</div>
						<div className="slide-item">
							<div
								className="slide-img"
								style={{
									backgroundImage:
										"url(./image/slides/kit-test-nhanh.png)",
								}}
							></div>
							<div className="slide-content">
								<div className="slide-content-up">
									Kit Test COVID bằng nước bọt
								</div>
								<div className="slide-content-down">
									<div className="describe">
										<li>Kit Test nhanh bằng nước bọt</li>
										<li>Đơn giản, tiện lợi, chính xác</li>
										<li>Bộ Y tế Việt Nam cấp chứng nhận</li>
									</div>
									<a href="#/">Xem chi tiết</a>
								</div>
							</div>
						</div>
						<div className="slide-item">
							<div
								className="slide-img"
								style={{
									backgroundImage:
										"url(./image/slides/medlatec.png)",
								}}
							></div>
							<div className="slide-content">
								<div className="slide-content-up">
									Nhận ngay voucher cho xét nghiệm bất kì tại
									Medlatec
								</div>
								<div className="slide-content-down">
									<div className="describe">
										<li>
											Đặt lịch xét nghiệm tại Hệ thống Y
											tế Medlatec qua DANA Hospital để nhận
											ngay Voucher 50.000đ/lần xét nghiệm
										</li>
									</div>
									<a href="#/">Xem chi tiết</a>
								</div>
							</div>
						</div>
						<div className="slide-item">
							<div
								className="slide-img"
								style={{
									backgroundImage:
										"url(./image/slides/phau-thuat-hitec.png)",
								}}
							></div>
							<div className="slide-content">
								<div className="slide-content-up">
									Giảm ngay 10 triệu khi phẫu thuật khúc xạ
									tại Hệ thống Bệnh viện Mắt Hitec
								</div>
								<div className="slide-content-down">
									<div className="describe">
										<li>
											Giảm 10 triệu đồng khi phẫu thuật
											khúc xạ Lasik Streamlight trong
											tháng 12
										</li>
									</div>
									<a href="#/">Xem chi tiết</a>
								</div>
							</div>
						</div>
						<div className="slide-item">
							<div
								className="slide-img"
								style={{
									backgroundImage:
										"url(./image/slides/tri-mun.jpg)",
								}}
							></div>
							<div className="slide-content">
								<div className="slide-content-up">
									Giờ vàng trị mụn chỉ từ 350k/buổi tại Phòng
									khám Da liễu Hà Nội
								</div>
								<div className="slide-content-down">
									<div className="describe">
										<li>
											Phòng khám Da liễu Hà Nội tặng ưu
											đãi cho khách hàng đăng ký trị mụn
											trong khung giờ vàng 8h00 - 11h00 và
											13h00 - 16h00
										</li>
									</div>
									<a href="#/">Xem chi tiết</a>
								</div>
							</div>
						</div>
						<div className="slide-item">
							<div
								className="slide-img"
								style={{
									backgroundImage:
										"url(./image/slides/uu-dai-benh-vien-bao-son.jpg)",
								}}
							></div>
							<div className="slide-content">
								<div className="slide-content-up">
									Khám tổng quát tháng 12 với ưu đãi đến 35%
									tại Bệnh viện Bảo Sơn
								</div>
								<div className="slide-content-down">
									<div className="describe">
										<li>
											Bệnh viện Bảo Sơn có nhiều ưu đãi
											cho khách hàng khám, nội soi, siêu
											âm,... trong tháng 12 này
										</li>
									</div>
									<a href="#/">Xem chi tiết</a>
								</div>
							</div>
						</div>
						<div className="slide-item">
							<div
								className="slide-img"
								style={{
									backgroundImage:
										"url(./image/slides/uu-dai-mat-dnd.png)",
								}}
							></div>
							<div className="slide-content">
								<div className="slide-content-up">
									Ưu đãi 40% phí khám và phẫu thuật tật khúc
									xạ tại Bệnh viện Mắt DND
								</div>
								<div className="slide-content-down">
									<div className="describe">
										<li>
											Từ 14/11/2022, khách hàng được hỗ
											trợ đến 40% chi phí khám và phẫu
											thuật khúc xạ
										</li>
									</div>
									<a href="#/">Xem chi tiết</a>
								</div>
							</div>
						</div>
						<div className="slide-item">
							<div
								className="slide-img"
								style={{
									backgroundImage:
										"url(./image/slides/test-covid.jpg)",
								}}
							></div>
							<div className="slide-content">
								<div className="slide-content-up">
									Xét nghiệm COVID
								</div>
								<div className="slide-content-down">
									<div className="describe">
										<li>Tầm soát và xác định COVID-19</li>
										<li>Phương pháp Test nhanh & PCR</li>
										<li>Theo quy chuẩn Bộ Y tế</li>
									</div>
									<a href="#/">Xem chi tiết</a>
								</div>
							</div>
						</div>
						<div className="buttons">
							<button className="prev" id="prev">
								<i className="fas fa-long-arrow-left"></i>
							</button>
							<button className="next" id="next">
								<i className="fas fa-long-arrow-right"></i>
							</button>
						</div>
					</div>
				</div> */}

					<div className="search-container">
						<div className="search-box">
							<input
								className="search-input"
								type="text"
								autoComplete="off"
								placeholder="Nhập tên bác sĩ"
								onChange={(event) =>
									this.handleOnchangeKeyword(event)
								}
							/>
							<select
								name="specialty"
								id="specialty-select"
								// value={this.state.specialty}
								onChange={(event) =>
									this.handleOnchangeSelect(
										event,
										"specialty"
									)
								}
								defaultValue={""}
							>
								<option value={""} defaultValue>
									Chọn chuyên khoa
								</option>
								{arrSpecialty &&
									arrSpecialty.length > 0 &&
									arrSpecialty.map((item, index) => (
										<option key={index} value={item.id}>
											{item.name}
										</option>
									))}
							</select>
							<button
								className="btn-search-doctor"
								onClick={() => this.filterDoctors()}
							>
								<i className="fa-solid fa-magnifying-glass"></i>
							</button>
						</div>
						<div className="search-results">
							<div className="search-results-list">
								{arrDoctorFilter &&
									arrDoctorFilter.length > 0 &&
									arrDoctorFilter.map((item, index) => {
										return (
											<div
												className="result-content"
												key={index}
												onClick={() =>
													this.handleViewDetail(item)
												}
											>
												<div
													className="result-img"
													style={{
														backgroundImage: `url(${
															item.image !== null
																? Buffer.from(
																		item.image,
																		"base64"
																  ).toString(
																		"binary"
																  )
																: "https://ihfeducation.ihf.info/images/no_avatar.gif"
														})`,
													}}
												></div>
												<div className="result-infor">
													<div className="result-name">
														{item.name
															? item.name
															: "Unknown name"}
													</div>
													<div className="result-specialty">
														{item.specialty
															? item.specialty
															: ""}
													</div>
												</div>
											</div>
										);
									})}
							</div>
						</div>
					</div>

					<Telemedicine />

					<Specialty />

					{/* <Facility /> */}

					<div className="outstanding-doctor-container">
						<div className="doctor-content-up">
							<div className="doctor-title">Bác sĩ nổi bật</div>
							<button
								className="doctor-btn"
								onClick={() => this.handleViewDoctors()}
							>
								Tất cả bác sĩ
							</button>
						</div>
						<div className="doctor-slide-container">
							<div id="doctor-slide">
								{arrDoctors &&
									arrDoctors.length > 0 &&
									arrDoctors.map((item, index) => {
										let doctorImage = new Buffer(
											item.image,
											"base64"
										).toString("binary");
										return (
											<div
												className="doctor-slide-item"
												key={index}
												onClick={() =>
													this.handleViewDetail(item)
												}
											>
												<div
													className="doctor-home-img"
													style={{
														backgroundImage: `url(${doctorImage})`,
													}}
												></div>
												<div className="doctor-infor">
													<div className="doctor-name">
														Bác sĩ {item.name}
													</div>
													<div>
														<p>{item.specialty}</p>
													</div>
												</div>
											</div>
										);
									})}
							</div>
						</div>
						<div className="doctor-buttons">
							<button
								className="doctor-prev"
								id="doctor-prev"
								onClick={() => this.handlePrevDoctor()}
							>
								<i className="fas fa-long-arrow-left"></i>
							</button>
							<button
								className="doctor-next"
								id="doctor-next"
								onClick={() => this.handleNextDoctor()}
							>
								<i className="fas fa-long-arrow-right"></i>
							</button>
						</div>
					</div>

					{/* <div className="handbook-container">
						<div className="handbook-content-up">
							<div className="handbook-title">Cẩm nang</div>
							<button className="handbook-btn">
								Tất cả bài viết
							</button>
						</div>
						<div className="handbook-slide-container">
							<div id="handbook-slide">
								<div className="handbook-slide-item">
									<div
										className="handbook-img"
										style={{
											backgroundImage:
												"url(./image/handbook/thumbnail-1.png)",
										}}
									></div>
									<div className="handbook-right-content">
										5 địa chỉ Nha khoa Thẩm mỹ mới, có cơ sở
										hiện đại và uy tín tại TPHCM
									</div>
								</div>
								<div className="handbook-slide-item">
									<div
										className="handbook-img"
										style={{
											backgroundImage:
												"url(./image/handbook/thumbnail-2.png)",
										}}
									></div>
									<div className="handbook-right-content">
										5 địa chỉ niềng răng ứng dụng công nghệ
										mới uy tín tại TPHCM
									</div>
								</div>
								<div className="handbook-slide-item">
									<div
										className="handbook-img"
										style={{
											backgroundImage:
												"url(./image/handbook/thumbnail-3.png)",
										}}
									></div>
									<div className="handbook-right-content">
										5 Địa chỉ Nha khoa uy tín với Đội ngũ
										bác sĩ trẻ tại TPHCM
									</div>
								</div>
								<div className="handbook-slide-item">
									<div
										className="handbook-img"
										style={{
											backgroundImage:
												"url(./image/handbook/thumbnail-4.png)",
										}}
									></div>
									<div className="handbook-right-content">
										Cắt Amidan bao nhiêu tiền? Chi phí cắt
										Amidan tại 5 địa chỉ uy tín TPHCM
									</div>
								</div>
							</div>
						</div>
						<div className="handbook-buttons">
							<button
								className="handbook-prev"
								id="handbook-prev"
							>
								<i className="fas fa-long-arrow-left"></i>
							</button>
							<button
								className="handbook-next"
								id="handbook-next"
							>
								<i className="fas fa-long-arrow-right"></i>
							</button>
						</div>
					</div>

					<div className="media-container">
						<div className="media-title">
							Truyền thông nói về DANA Hospital
						</div>
						<div className="media-content">
							<div className="media-content-left">
								<div className="media-video">
									<iframe
										src="https://www.youtube.com/embed/FyDQljKtWnI"
										title="HỆ THỐNG ĐẶT LỊCH KHÁM TRỰC TUYẾN"
										frameBorder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									></iframe>
								</div>
							</div>
							<div className="media-content-right">
								<div
									className="media-img"
									style={{
										backgroundImage:
											"url(./image/media/medias.jpg)",
									}}
								></div>
							</div>
						</div>
					</div>

					<div className="download-container">
						<div className="download-left">
							<div
								className="download-img"
								style={{
									backgroundImage:
										"url(./image/download/download.png)",
								}}
							></div>
						</div>
						<div className="download-right">
							<div className="download-right-content">
								<h2>Tải ứng dụng DANA Hospital</h2>
								<div className="app-features">
									<li>
										<i className="fas fa-check"></i>Đặt khám
										nhanh hơn
									</li>
									<li>
										<i className="fas fa-check"></i>Nhận
										thông báo từ hệ thống
									</li>
									<li>
										<i className="fas fa-check"></i>Nhận
										hướng dẫn đi khám chi tiết
									</li>
								</div>
								<div className="app-download">
									<div className="app-android"></div>
									<div className="app-ios"></div>
								</div>
								<div className="app-link">
									<p>
										Hoặc mở liên kết:
										<a href="#/">
											https://bookingcare.vn/app
										</a>
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="posts-container">
						<div className="posts-content-up">
							<div className="posts-title">
								Dành cho bác sĩ và cơ sở y tế
							</div>
							<div className="post-btns">
								<button className="posts-btn">Bài viết</button>
								<button className="posts-btn">Hợp tác</button>
								<button className="posts-btn">Liên hệ</button>
							</div>
						</div>
						<div className="posts-slide-container">
							<div id="posts-slide">
								<div className="posts-slide-item">
									<div
										className="posts-img"
										style={{
											backgroundImage:
												"url(./image/posts/post1.png)",
										}}
									></div>
									<div className="posts-right-content">
										10X Content là gì? Cách xây dựng Content
										SEO Y tế theo 10X Content
									</div>
								</div>
								<div className="posts-slide-item">
									<div
										className="posts-img"
										style={{
											backgroundImage:
												"url(./image/posts/post2.png)",
										}}
									></div>
									<div className="posts-right-content">
										Cách sử dụng Google Keyword Planner để
										chọn từ khóa bài viết
									</div>
								</div>
								<div className="posts-slide-item">
									<div
										className="posts-img"
										style={{
											backgroundImage:
												"url(./image/posts/post3.jpg)",
										}}
									></div>
									<div className="posts-right-content">
										Các Module quan trọng trong thiết kế
										Website phòng khám
									</div>
								</div>
								<div className="posts-slide-item">
									<div
										className="posts-img"
										style={{
											backgroundImage:
												"url(./image/posts/post4.png)",
										}}
									></div>
									<div className="posts-right-content">
										Marketing phòng khám - Phần 1: Chiến
										lược tập trung vào chất lượng khám chữa
										bệnh
									</div>
								</div>
							</div>
						</div>
						<div className="posts-buttons">
							<button className="posts-prev" id="posts-prev">
								<i className="fas fa-long-arrow-left"></i>
							</button>
							<button className="posts-next" id="posts-next">
								<i className="fas fa-long-arrow-right"></i>
							</button>
						</div>
					</div> */}

					<Footer />

					<div className="footer2">
						<div className="footer-left">
							<p>&copy; 2022 Pham Duc Tinh</p>
						</div>
						<div className="footer-right">
							<i className="fab fa-facebook-square"></i>
							<i className="fab fa-youtube"></i>
							<i className="fab fa-instagram"></i>
							<i className="fab fa-twitter"></i>
						</div>
					</div>
				</div>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.user.isLoggedIn,
		userInfor: state.user.userInfo,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		processLogout: () => dispatch(actions.processLogout()),
	};
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(HomePage)
);
