import { createSlice } from "@reduxjs/toolkit";

interface IUserState {
	name: string | null;
	role: "Admin" | "Teacher" | "Student" | null;
}

const initialState = {
	name: null,
	role: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		saveSignIn: (state: IUserState, action) => {
			state.name = action.payload.name;
			state.role = action.payload.role;
		},
		removeSignIn: (state) => {
			state.name = null;
			state.role = null;
		},
	},
});

export const { saveSignIn, removeSignIn } = userSlice.actions;
export default userSlice.reducer;
