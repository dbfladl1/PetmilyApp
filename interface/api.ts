import { AxiosResponse } from "axios";

export type ApiSuccess = { success: true; response: AxiosResponse };
export type ApiFailure = { success: false; status: number; message: string };
export type ApiResult = ApiSuccess | ApiFailure;