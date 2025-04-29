import { modifyUserInfo } from "@/interface/user";
import apiClient from "./apiClient";

export const checkIdDupicate = async (userId: string) => {
  try {
    const response = await apiClient.get(`/api/v1/member/check-id/${userId}`);

    return response.status;
  } catch (error) {
    console.error("Error during API call:", error);

    throw error;
  }
};

export const putMemberProfileImg = async (file: FormData) => {
  try {
    const response = await apiClient.put(`/api/v1/member/image`);

    return response.status;
  } catch (error) {
    console.error("Error during API call:", error);

    throw error;
  }
};

export const sendAuthCodeToEmail = async (data: { email: string }) => {
  try {
    const response = await apiClient.post(
      "/api/v1/member/email-auth/send-code",
      data
    );
    
    return response.status;
  } catch (error) {
    console.error("Error during API call:", error);

    throw error;
  }
};

export const matchAuth = async (data: { email: string; authCode: string }) => {
  try {
    const response = await apiClient.post(
      "/api/v1/member/email-auth/verify-code",
      data
    );

    return response.status;
  } catch (error) {
    console.error("Error during API call:", error);

    throw error;
  }
};

export const joinUser = async (data: {
  loginId: string;
  password: string;
  email: string;
  phone: string;
  gender: string;
  recoveryQuestion: string;
  recoveryAnswer: string;
}) => {
  try {
    const response = await apiClient.post(`/api/v1/member/register`, data);
    return response;
  } catch (error) {
    console.log("err", error);
  }
};

export const login = async (data: { loginId: string; password: string }) => {
  try {
    const response = await apiClient.post(`/api/v1/member/login`, data);
    return response;
  } catch (error) {
    console.log("err", error);
  }
};

export const submitRefreshToken = async (data: { refreshToken: string }) => {
  try {
    const response = await apiClient.post("/api/v1/member/token/refresh", data);
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);

    throw error;
  }
};
export const testLogin = async (data: {
  loginId: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post(
      `/api/v1/member/login/expiretoken`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await apiClient.get("/api/v1/member");

    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);

    throw error;
  }
};

export const modifyUser = async (user: modifyUserInfo) => {
  console.log("respne!!!",user);
  try {
    const response = await apiClient.put("/api/v1/member", user);
    console.log("respne!!!",response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const profileUpdate = async (imageUri: string) => {
  try {
    const formData = new FormData();

    const normalizedUri = imageUri.startsWith("file://")
      ? imageUri
      : `file://${imageUri}`;
    const fileName = normalizedUri.split("/").pop();
    const fileType = `image/${fileName?.split(".").pop()}`;

    formData.append("file", {
      uri: normalizedUri,
      name: fileName,
      type: fileType,
    } as any);
    const response = await apiClient.put("/api/v1/member/image", formData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
      transformRequest: (data) => {
        return data;
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};
