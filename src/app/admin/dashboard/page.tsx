import DashboardComponent from "@/components/pages/dashboard";
import { ROUTES } from "@/constants";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect(ROUTES.AUTH_LOGIN);
  }

  return <DashboardComponent />;
}
