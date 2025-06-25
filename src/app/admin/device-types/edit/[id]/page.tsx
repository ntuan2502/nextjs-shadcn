import EditDeviceTypeComponent from "@/components/pages/device-types/edit";
import { ROUTES } from "@/constants";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { ParamsWithId } from "@/types/data";
import { redirect } from "next/navigation";

export default async function EditDeviceTypeAdminPage({
  params,
}: ParamsWithId) {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect(ROUTES.AUTH_LOGIN);
  }

  const { id } = await params;

  return <EditDeviceTypeComponent id={id} />;
}
