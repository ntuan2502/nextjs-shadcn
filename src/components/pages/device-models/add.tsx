"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ENV, ROUTES } from "@/constants";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInstance";
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/lib/handleAxiosFeedback";
import { useRouter } from "next/navigation";

export default function AddDeviceModelComponent() {
  const { t } = useTranslation();
  const router = useRouter();

  const FormSchema = z.object({
    name: z.string().min(1, {
      message: t("ui.message.nameRequired"),
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await axiosInstance.post(`${ENV.API_URL}/device-models`, {
        ...data,
      });
      handleAxiosSuccess(res);
      router.push(ROUTES.DEVICE_MODELS);
    } catch (err) {
      handleAxiosError(err);
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <Link href={ROUTES.ADMIN_DASHBOARD}>
                {t("ui.label.dashboard")}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <Link href={ROUTES.DEVICE_MODELS}>
                {t("ui.label.deviceModels")}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("ui.button.add")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="w-full mx-auto p-6 space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("ui.label.name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t("ui.button.submit")}</Button>
          </form>
        </Form>
      </div>
    </SidebarInset>
  );
}
