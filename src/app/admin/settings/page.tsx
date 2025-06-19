import SettingsComponent from "@/components/pages/settings";
import { ROUTES } from "@/constants";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect(ROUTES.AUTH_LOGIN);
  }

  return <SettingsComponent />;
}
