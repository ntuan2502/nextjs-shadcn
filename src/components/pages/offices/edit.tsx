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
import { useCallback, useEffect } from "react";
import { Office } from "@/types/data";

export default function EditOfficeComponent({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();

  const FormSchema = z.object({
    name: z.string().min(1, {
      message: t("ui.message.nameRequired"),
    }),
    nameEn: z.string().min(1, {
      message: t("ui.message.nameEnRequired"),
    }),
    shortName: z.string().min(1, {
      message: t("ui.message.shortNameRequired"),
    }),
    taxCode: z.string().min(1, { message: t("ui.message.taxCodeRequired") }),
    address: z.string().min(1, {
      message: t("ui.message.addressRequired"),
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      nameEn: "",
      shortName: "",
      taxCode: "",
      address: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await axiosInstance.patch(`${ENV.API_URL}/offices/${id}`, {
        ...data,
      });
      handleAxiosSuccess(res);
      router.push(ROUTES.OFFICES);
    } catch (err) {
      handleAxiosError(err);
    }
  }

  const fetchOffice = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/offices/${id}`);
      const data: Office = res.data.data.office;
      form.reset({
        ...data,
      });
    } catch (err) {
      handleAxiosError(err);
    }
  }, [id, form]);

  useEffect(() => {
    fetchOffice();
  }, [fetchOffice]);

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
              <Link href={ROUTES.OFFICES}>{t("ui.label.offices")}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("ui.button.edit")}</BreadcrumbPage>
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
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.nameEn")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("ui.label.nameEn")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.shortName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("ui.label.shortName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.taxCode")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("ui.label.taxCode")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.address")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("ui.label.address")} {...field} />
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
