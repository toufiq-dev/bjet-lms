import userInstance from "../utils/userInstance";

const useUser = () => {
	const signIn = async (formData: { email: string; password: string }) => {
		try {
			const response = await userInstance.post("/signin", formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			return response.data;
		} catch (error) {
			return { error: error };
		}
	};

	return { signIn };
};

export default useUser;
