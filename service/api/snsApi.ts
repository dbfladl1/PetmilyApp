import { getAccessToken } from "@/src/hooks/useAuth";
import { useAuth } from "@/src/context/AuthContext";
import apiClient from "./apiClient";

const accessToken = getAccessToken();

export const loadAllFeedContents = async () => {
  try {
    const response = await apiClient.get("/api/v1/feed/all");
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);

    throw error;
  }
};

// export const loadComment = async (id: number) => {
//   try {
//     const response = await apiClient.get(`/api/v1/feed/${id}`);
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error during API call:", error);

//     throw error;
//   }
// };

export const addLike = async (data: { postId: string }) => {
  try {
    const response = await apiClient.post(`/api/v1/feed/click-like`, data);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const deleteFeed = async (id: string) => {
  try {
    const response = await apiClient.delete(`/api/v1/feed/${id}`);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const uploadFeed = async (content: string, imageUris: string[]) => {
  try {
    const formData = new FormData();

    formData.append("content", content);

    for (let imageUri of imageUris) {
      const normalizedUri = imageUri.startsWith("file://")
        ? imageUri
        : `file://${imageUri}`;
      const fileName = normalizedUri.split("/").pop();
      const fileType = `image/${fileName?.split(".").pop()}`;

      formData.append("files", {
        uri: normalizedUri,
        name: fileName,
        type: fileType,
      } as any);
    }

    const response = await apiClient.post("/api/v1/feed", formData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
      transformRequest: (data, headers) => {
        return data;
      },
    });
    console.log(response);
    return response.status;
  } catch (error) {
    console.error("게시글 업로드 실패:", error);

    throw error;
  }
};
