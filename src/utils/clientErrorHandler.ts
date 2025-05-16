import { alertDialog } from "@/components/atom/Alert";

export function handleCommonApiError(status: number, message: string) {
  if (status === -999 || status === -1) {
    alertDialog("예기치 못한 에러가 발생했습니다.");
    return;
  } else {
    alertDialog(message);
    return;
  }
}
