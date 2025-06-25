import UsersComponent from "@/components/pages/users";
import { ROUTES } from "@/constants";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect(ROUTES.AUTH_LOGIN);
  }

  return <UsersComponent />;
}
