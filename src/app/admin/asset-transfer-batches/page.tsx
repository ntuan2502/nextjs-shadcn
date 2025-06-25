import AssetTransferBatchesComponent from "@/components/pages/asset-transfer-batches";
import { ROUTES } from "@/constants";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function AssetTransferBatchesPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect(ROUTES.AUTH_LOGIN);
  }

  return <AssetTransferBatchesComponent />;
}
