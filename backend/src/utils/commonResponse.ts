import { Response } from "express";

interface SuccessResponse {
	success: true;
	message: string;
	data: any;
}

interface ErrorResponse {
	success: false;
	message: string;
	errors: any;
}

type ApiResponse = SuccessResponse | ErrorResponse;

const sendResponse = (
	res: Response,
	status: number,
	message: string,
	result: any = null
) => {
	let response: ApiResponse;

	if (status >= 400) {
		response = {
			success: false,
			message: "Internal server error",
			errors: result,
		};
	} else {
		response = {
			success: true,
			message: "Successfully completed operations",
			data: result,
		};
	}

	if (message) {
		response.message = message;
	}
	res.status(status).send(response);
};

export default sendResponse;
