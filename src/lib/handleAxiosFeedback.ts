import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

/**
 * Hiển thị thông báo lỗi từ Axios response
 * @param err Axios error object
 * @param fallbackMessage Thông báo mặc định nếu không có message từ server
 */
export function handleAxiosError(
  err: unknown,
  fallbackMessage = "Đã xảy ra lỗi, vui lòng thử lại!"
) {
  const error = err as AxiosError<{ message?: string | string[] }>;
  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    toast.error(message[0]);
  } else if (typeof message === "string") {
    toast.error(message);
  } else {
    toast.error(fallbackMessage);
  }
}

/**
 * Hiển thị thông báo thành công từ Axios response
 * @param res Axios response object
 * @param fallbackMessage Thông báo mặc định nếu không có message trong response
 */
export function handleAxiosSuccess(
  res: AxiosResponse,
  fallbackMessage = "Thao tác thành công!"
) {
  const message = res.data?.message;

  if (Array.isArray(message)) {
    toast.success(message[0]);
  } else if (typeof message === "string") {
    toast.success(message);
  } else {
    toast.success(fallbackMessage);
  }
}
