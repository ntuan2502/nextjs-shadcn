import CreateRequestAssetAdminComponent from "@/components/pages/assets/create-request";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { ParamsWithId } from "@/types/data";
import { redirect } from "next/navigation";

export default async function CreateRequestAssetAdminPage({
  params,
}: ParamsWithId) {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  const { id } = await params;

  return <CreateRequestAssetAdminComponent id={id} />;
}
