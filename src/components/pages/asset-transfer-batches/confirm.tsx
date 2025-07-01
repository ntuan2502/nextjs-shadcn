"use client";

import { ReactSignature } from "@/components/react-signature";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ENV } from "@/constants";
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/lib/handleAxiosFeedback";
import { base64ToFile } from "@/lib/utils";
import { AssetTransferBatch } from "@/types/data";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NotFound from "@/app/not-found";
import LoadingDot from "@/components/loading-dot";

export default function ConfirmAssetTransferBatchComponent({
  id,
}: {
  id: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isConfirm, setIsConfirm] = useState<boolean>();
  const [assetTransferBatch, setAssetTransferBatch] =
    useState<AssetTransferBatch>();

  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  useEffect(() => {
    async function getConfirmRequest(id: string) {
      try {
        const res = await axios.get(
          `${ENV.API_URL}/asset-transfer-batches/confirm-request/${id}?type=${type}`
        );
        setIsConfirm(true);
        setAssetTransferBatch(res.data.data.assetTransferBatch);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setIsConfirm(false);
        } else {
          console.error(err);
          handleAxiosError(err);
        }
      }
    }
    getConfirmRequest(id);
  }, [id, type]);

  const FormSchema = z.object({
    signature: z.string().nullable(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      signature: null,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!data.signature) return toast.error(t("ui.label.noSignature"));
    try {
      const formDataToSend = new FormData();

      if (data.signature) {
        // Tạo file từ base64
        const file = base64ToFile(data.signature, "signature.png");
        formDataToSend.append("toSignature", file);
      }

      const res = await axios.post(
        `${ENV.API_URL}/asset-transfer-batches/confirm-request/${id}?type=${type}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      handleAxiosSuccess(res);
      router.push(
        ENV.API_URL + res.data.data.returnAssetTransferBatch.handover.filePath
      );
    } catch (err) {
      handleAxiosError(err);
    }
  }

  if (isConfirm === undefined) return <LoadingDot />;
  else if (isConfirm === false) {
    return <NotFound />;
  }

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <div className="flex h-full w-full items-center justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-3">
            <ReactSignature
              className="max-w-96"
              label={t("ui.label.signature")}
              onDownload={(url) => form.setValue("signature", url)}
            />

            <Button type="submit">{t("ui.button.submit")}</Button>
          </form>
        </Form>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex w-full max-w-3xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("ui.label.internalCode")}</TableHead>
                <TableHead>{t("ui.label.deviceType")}</TableHead>
                <TableHead>{t("ui.label.deviceModel")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(assetTransferBatch?.assetTransactions || []).map(
                (assetTransaction) => (
                  <TableRow key={assetTransaction.id}>
                    <TableCell>
                      {assetTransaction.asset?.internalCode}
                    </TableCell>
                    <TableCell>
                      {assetTransaction.asset?.deviceType?.name}
                    </TableCell>
                    <TableCell>
                      {assetTransaction.asset?.deviceModel?.name}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
