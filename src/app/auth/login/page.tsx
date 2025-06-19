import LoginComponent from "@/components/pages/login";
import { ROUTES } from "@/constants";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const name = await getUserFromCookies();

  if (name) {
    return redirect(ROUTES.ADMIN_DASHBOARD);
  }

  return <LoginComponent />;
}
