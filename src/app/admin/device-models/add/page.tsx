import AddDeviceModelComponent from "@/components/pages/device-models/add";
import { ROUTES } from "@/constants";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function AddDeviceModelPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect(ROUTES.AUTH_LOGIN);
  }

  return <AddDeviceModelComponent />;
}
