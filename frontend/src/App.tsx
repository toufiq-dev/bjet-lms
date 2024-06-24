import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/sign-in/SignInPage";
import ProfilePage from "./pages/ProfilePage"; 
import CssBaseline from "@mui/material/CssBaseline";

const App = () => {
	return (
		<>
			<CssBaseline />
			<Router>
				<Routes>
					<Route path="/" element={<SignInPage />} />
					<Route path="/profile" element={<ProfilePage />} />
				</Routes>
			</Router>
		</>
	);
};

export default App;
