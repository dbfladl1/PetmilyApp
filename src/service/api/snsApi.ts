import { ApiService } from "./ApiService";

export const loadAllFeedContents = async () => {
  const response = await ApiService.get("/api/v1/feed/all");

  return response;
};

export const loadPost = async (id: string) => {
  const response = await ApiService.get(`/api/v1/feed/${id}`);

  return response;
};

export const loadComment = async (feedId: string) => {
  const response = await ApiService.get(`/api/v1/feed/${feedId}/comments`);
  console.log("ddd",feedId)
  console.log(response)

  return response;
};

export const createComment = async (
  feedId: string,
  data: { content: string; parentComentId: string }
) => {
  const response = await ApiService.post(
    `/api/v1/feed/${feedId}/comments`,
    data
  );

  return response;
};

export const deleteComment = async (feedId: string, commentId: string) => {
  const response = await ApiService.delete(
    `/api/v1/feed/${feedId}/comments/${commentId}`
  );

  return response;
};

export const addLike = async (data: { postId: string }) => {
  const response = await ApiService.post(`/api/v1/feed/click-like`, data);

  return response;
};

export const deleteFeed = async (id: string) => {
  const response = await ApiService.delete(`/api/v1/feed/${id}`);

  return response;
};

export const uploadFeed = async (content: string, imageUris: string[]) => {
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

  const response = await ApiService.post("/api/v1/feed", formData, {
    headers: {
      Accept: "*/*",
      "Content-Type": "multipart/form-data",
    },
    transformRequest: (data, headers) => {
      return data;
    },
  });

  return response;
};
