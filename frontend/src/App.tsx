import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import CssBaseline from "@mui/material/CssBaseline";

const App = () => {
	return (
		<>
			<CssBaseline />
			<Router>
				<Routes>
					<Route path="/" element={<SignInPage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/admin" element={<AdminPage />} />
				</Routes>
			</Router>
		</>
	);
};

export default App;
