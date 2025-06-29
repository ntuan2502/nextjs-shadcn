import HomeComponent from "@/components/pages/home";
import { ROUTES } from "@/constants";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const name = await getUserFromCookies();

  if (name) {
    return redirect(ROUTES.ADMIN_DASHBOARD);
  }

  return <HomeComponent />;
}
