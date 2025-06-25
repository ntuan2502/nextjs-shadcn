import DepartmentsComponent from "@/components/pages/departments";
import { ROUTES } from "@/constants";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function DepartmentsPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect(ROUTES.AUTH_LOGIN);
  }

  return <DepartmentsComponent />;
}
