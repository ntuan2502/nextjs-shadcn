import ConfirmAssetTransferBatchComponent from "@/components/pages/asset-transfer-batches/confirm";
import { ParamsWithId } from "@/types/data";

export default async function ConfirmAssetTransferBatchPage({
  params,
}: ParamsWithId) {
  const { id } = await params;

  return <ConfirmAssetTransferBatchComponent id={id} />;
}
