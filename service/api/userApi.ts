import { modifyUserInfo } from "@/interface/user";
import { ApiService } from "./ApiService";

export const checkUserInfo = async () => {
  const response = await ApiService.get(`/api/v1/member`);
  return response;
};

export const checkIdDupicate = async (userId: string) => {
  const response = await ApiService.get(`/api/v1/member/check-id/${userId}`);

  return response;
};

export const sendAuthCodeToEmail = async (data: { email: string }) => {
  const response =await ApiService.post("/api/v1/member/email-auth/send-code", data);

  return response;
};

export const matchAuth = async (data: { email: string; authCode: string }) => {
  const response =await ApiService.post(
    "/api/v1/member/email-auth/verify-code",
    data
  );
  return response;
};

export const joinUser = async (data: {
  loginId: string;
  password: string;
  email: string;
  phone?: string;
  address?: string;
  gender: string;
}) => {
  const response = ApiService.post(`/api/v1/member/register`, data);
  return response;
};

export const login = async (data: { loginId: string; password: string }) => {
  const response = await ApiService.post("/api/v1/member/login", data);
  return response;
};

export const submitRefreshToken = async (data: { refreshToken: string }) => {
  const response = await ApiService.post("/api/v1/member/token/refresh", data);
  return response;
};

export const getUserInfo = async () => {
  const response = await ApiService.get("/api/v1/member");
  return response;
};

export const modifyUser = async (updateMember : modifyUserInfo) => {
  const response =await ApiService.put("/api/v1/member", updateMember );
  console.log(updateMember )
  return response;
};

export const profileImgUpdate = async (imageUri: string) => {
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
  const response = await ApiService.put("/api/v1/member/image", formData, {
    headers: {
      Accept: "*/*",
      "Content-Type": "multipart/form-data",
    },
    transformRequest: (data) => {
      return data;
    },
  });
  return response;
};
