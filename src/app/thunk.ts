import { createAsyncThunk } from "@reduxjs/toolkit";
type asyncThunkProps = {
	type: string;
	action: (data: any) => Promise<
		| {
				code: number;
				data: any;
				message?: undefined;
		  }
		| {
				code: number;
				message: string;
				data?: undefined;
		  }
	>;
};
export const commonCreateAsyncThunk = (props: asyncThunkProps) => {
	return createAsyncThunk(props.type, async (data, { rejectWithValue }) => {
		try {
			const response = await props.action(data);
			return response;
		} catch (err: any) {
			//console.log("rejectWithValue",err)
			return rejectWithValue(err);
		}
	});
};
type asyncThunkPropsClover = {
	type: string;
	action: (data: any) => Promise<any>;
};

export const commonCreateAsyncThunkClover = (props: asyncThunkPropsClover) => {
	return createAsyncThunk(props.type, async (data, { rejectWithValue }) => {
		try {
			const response = await props.action(data);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.message || "An error occurred");
		}
	});
};
