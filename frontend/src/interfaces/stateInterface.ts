export default interface IState {
  user: {
    id: string | null;
    name: string | null;
    role: "Admin" | "Teacher" | "Student" | null;
  };
}
