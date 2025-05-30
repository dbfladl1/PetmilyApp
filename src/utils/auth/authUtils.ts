import { ApiResult } from "@/src/interface/api";
import { checkUserInfo } from "@/src/service/api/userApi";
import { apiProcess } from "../handler/clientResHandler";

export const isPostWriter = async (writerId: string) => {
    const res: ApiResult = await checkUserInfo();
    const isWriter = await apiProcess(
      res,
      async (res) => res.response.data.loginId === writerId
    );
    return isWriter;
  };