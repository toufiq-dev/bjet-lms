export default interface IState {
	user: {
		name: string | null;
		role: "Admin" | "Teacher" | "Student" | null;
	};
}
