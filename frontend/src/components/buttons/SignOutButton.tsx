import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { removeSignIn } from "../../redux/slices/userSlice";

const SignOutButton = () => {
	const dispatch = useDispatch();

	return (
		<>
			<Button
				variant="contained"
				onClick={() => dispatch(removeSignIn())}
			>
				Sign Out
			</Button>
		</>
	);
};

export default SignOutButton;
