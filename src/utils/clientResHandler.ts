import { alertDialog } from "@/components/atom/Alert";
import { ApiResult, ApiSuccess } from "@/interface/api";

function returnCommonApiError(status: number, message: string) {
  if (status === -999 || status === -1) {
    alertDialog("예기치 못한 에러가 발생했습니다.");
    return;
  } else {
    alertDialog(message);
    return;
  }
}

export const apiProcess = async (
  res: ApiResult,
  callback: (res: ApiSuccess) => Promise<void>
) => {
  if (!res.success) {
    const { status, message } = res;
    returnCommonApiError(status, message);
  } else {
    await callback(res);
  }
};
