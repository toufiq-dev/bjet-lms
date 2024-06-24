import axios from "axios";

const userInstance = axios.create({
	baseURL: `${import.meta.env.SERVER_URL}/users`,
	timeout: 10000,
});

export default userInstance;
