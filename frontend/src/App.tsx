import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import ProfilePage from "./pages/ProfilePage";
import CssBaseline from "@mui/material/CssBaseline";
import NonUserAuth from "./middleware/NonUserAuth";
import UserAuth from "./middleware/UserAuth";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAuth from "./middleware/AdminAuth";

const App = () => {
	return (
		<>
			<CssBaseline />
			<Router>
				<Routes>
					<Route element={<NonUserAuth />}>
						<Route path="/sign-in" element={<SignInPage />} />
					</Route>

					<Route element={<UserAuth />}>
						<Route path="/" element={<UserDashboard />} />
						<Route path="/profile" element={<ProfilePage />} />
					</Route>

					<Route element={<AdminAuth />}>
						<Route path="/admin" element={<AdminDashboard />} />
					</Route>
				</Routes>
			</Router>
		</>
	);
};

export default App;
