import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useForm, Controller } from "react-hook-form";
import useUser from "../../hooks/useUser";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

const SignInForm = () => {
	const [showCircularProgress, setShowCircularProgress] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const {
		handleSubmit,
		control,
		formState: { errors },
		getValues,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { signIn } = useUser();

	const handlerOnSubmit = async () => {
		setShowCircularProgress(true);
		const formData = {
			email: getValues("email"),
			password: getValues("password"),
		};

		const result = await signIn(formData);
		if (result.error) {
			setShowCircularProgress(false);
		} else {
			setShowCircularProgress(false);
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 16,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography component="h1" variant="h4">
					Sign in
				</Typography>
				<Box
					component="form"
					onSubmit={handleSubmit(handlerOnSubmit)}
					sx={{ mt: 1 }}
				>
					<Controller
						name="email"
						control={control}
						rules={{
							maxLength: {
								value: 320,
								message: "Invalid email format",
							},
							pattern: {
								value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
								message: "Invalid email format",
							},
						}}
						render={({ field }) => (
							<TextField
								margin="normal"
								required
								fullWidth
								id="email"
								label={
									errors.email
										? errors.email.message
										: "Email"
								}
								autoComplete="email"
								autoFocus
								{...field}
								error={errors.email ? true : false}
							/>
						)}
					/>
					<Controller
						name="password"
						control={control}
						rules={{
							minLength: {
								value: 8,
								message:
									"Password must contain at least 8 characters",
							},
							maxLength: {
								value: 20,
								message: "Character limit exceeded",
							},
							pattern: {
								value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
								message:
									"Password must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol",
							},
						}}
						render={({ field }) => (
							<TextField
								type={showPassword ? "text" : "password"}
								margin="normal"
								required
								fullWidth
								id="password"
								label={
									errors.password
										? "Invalid password format"
										: "Password"
								}
								helperText={
									errors.password && errors.password.message
								}
								autoComplete="current-password"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												edge="end"
												onClick={() =>
													setShowPassword(
														!showPassword
													)
												}
												onMouseDown={(
													e: React.MouseEvent<HTMLButtonElement>
												) => e.preventDefault()}
											>
												{showPassword ? (
													<VisibilityOff />
												) : (
													<Visibility />
												)}
											</IconButton>
										</InputAdornment>
									),
								}}
								{...field}
								error={errors.password ? true : false}
							/>
						)}
					/>
					<Button
						type="submit"
						variant="contained"
						fullWidth
						sx={{ mt: 3, mb: 2 }}
					>
						{showCircularProgress === true ? (
							<CircularProgress color="inherit" size={25} />
						) : (
							<>Sign In</>
						)}
					</Button>
					<Link href="/forgot-password" variant="body2">
						Forgot password?
					</Link>
				</Box>
			</Box>
		</Container>
	);
};

export default SignInForm;
