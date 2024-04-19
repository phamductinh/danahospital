import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";
import {
	userIsAuthenticated,
	userIsNotAuthenticated,
} from "../hoc/authentication";

import { path } from "../utils";

import Home from "../routes/Home";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import System from "../routes/System";
import HomePage from "./HomePage/HomePage";
import DetailTelemedicine from "./System/DetailTelemedicine";
import CustomScrollbars from "../components/CustomScrollbars";
import DetailDoctor from "./System/Doctor/DetailDoctor";
import Booking from "./System/Doctor/Booking";
import BookingCall from "./System/Doctor/BookingCall";
import CallingHome from "./VideoCall/CallingHome";
import Room from "./VideoCall/Room";
import DetailSpecialty from "./System/DetailSpecialty";
import BookingHistory from "./System/BookingHistory";
import UpdateInfor from "./System/UpdateInfor";
import confirmEmail from "./Auth/confirmEmail";
import changePassword from "./Auth/changePassword";

class App extends Component {
	handlePersistorState = () => {
		const { persistor } = this.props;
		let { bootstrapped } = persistor.getState();
		if (bootstrapped) {
			if (this.props.onBeforeLift) {
				Promise.resolve(this.props.onBeforeLift())
					.then(() => this.setState({ bootstrapped: true }))
					.catch(() => this.setState({ bootstrapped: true }));
			} else {
				this.setState({ bootstrapped: true });
			}
		}
	};

	componentDidMount() {
		this.handlePersistorState();
	}

	render() {
		return (
			<Fragment>
				<Router history={history}>
					<div className="main-container">
						{/* {this.props.isLoggedIn && <Header />} */}

						<div className="content-container">
							<CustomScrollbars
								style={{ height: "100vh", width: "100%" }}
							>
								<Switch>
									<Route
										path={path.HOME}
										exact
										component={Home}
									/>
									<Route
										path={path.LOGIN}
										component={userIsNotAuthenticated(
											Login
										)}
									/>
									<Route
										path={path.SIGNUP}
										component={SignUp}
									/>
									<Route
										path={path.SYSTEM}
										component={userIsAuthenticated(System)}
									/>

									<Route
										path={path.HOMEPAGE}
										exact
										component={HomePage}
									/>
									<Route
										path={"/detail-doctor/:id"}
										component={DetailDoctor}
									/>
									<Route
										path={"/booking/:id"}
										component={Booking}
									/>
									<Route
										path={"/booking-call-video/:id"}
										component={BookingCall}
									/>
									<Route
										exact
										path="/join-room"
										component={CallingHome}
									/>
									<Route
										exact
										path={"/room/:code"}
										component={Room}
									/>
									<Route
										exact
										path={"/telemedicine/:id"}
										component={DetailTelemedicine}
									/>
									<Route
										exact
										path={"/specialty/:id"}
										component={DetailSpecialty}
									/>
									<Route
										path={"/booking-history/:id"}
										component={BookingHistory}
									/>
									<Route
										path={"/update-infor/:id"}
										component={UpdateInfor}
									/>
									<Route
										path={"/change-password/:id"}
										component={userIsAuthenticated(
											changePassword
										)}
									/>
									<Route
										path={"/forgot-password"}
										component={confirmEmail}
									/>
								</Switch>
							</CustomScrollbars>
						</div>

						<ToastContainer
							position="bottom-right"
							autoClose={5000}
							hideProgressBar={false}
							newestOnTop={false}
							closeOnClick
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
							theme="light"
						/>
					</div>
				</Router>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		started: state.app.started,
		isLoggedIn: state.user.isLoggedIn,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
