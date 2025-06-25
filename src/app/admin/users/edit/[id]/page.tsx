import EditUserComponent from "@/components/pages/users/edit";
import { ROUTES } from "@/constants";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { ParamsWithId } from "@/types/data";
import { redirect } from "next/navigation";

export default async function EditUserAdminPage({
  params,
}: ParamsWithId) {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect(ROUTES.AUTH_LOGIN);
  }

  const { id } = await params;

  return <EditUserComponent id={id} />;
}
