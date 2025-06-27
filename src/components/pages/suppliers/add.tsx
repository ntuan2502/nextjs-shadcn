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
import { toast } from "react-toastify";

export default function AddSupplierComponent() {
  const { t } = useTranslation();
  const router = useRouter();

  const FormSchema = z.object({
    name: z.string().min(1, {
      message: t("ui.message.nameRequired"),
    }),
    internationalName: z.string().optional(),
    shortName: z.string().optional(),
    address: z.string().min(1, {
      message: t("ui.message.addressRequired"),
    }),
    taxCode: z.string().min(1, { message: t("ui.message.taxCodeRequired") }),
    phone: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      internationalName: "",
      shortName: "",
      address: "",
      taxCode: "",
      phone: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await axiosInstance.post(`${ENV.API_URL}/suppliers`, {
        ...data,
      });
      handleAxiosSuccess(res);
      router.push(ROUTES.SUPPLIERS);
    } catch (err) {
      handleAxiosError(err);
    }
  }

  const handleAutoFill = async () => {
    const res = await axiosInstance.get(
      `https://api.vietqr.io/v2/business/${form.getValues("taxCode")}`
    );
    if (res.data.data === null)
      return toast.error(t("ui.message.taxCodeNotFound"));
    const data = res.data.data;
    toast.success(t("ui.message.informationFound", { name: data.name }));
    form.setValue("taxCode", data.id, {
      shouldValidate: true,
    });
    form.setValue("name", data.name, {
      shouldValidate: true,
    });
    form.setValue("internationalName", data.internationalName, {
      shouldValidate: true,
    });
    form.setValue("shortName", data.shortName ?? "", {
      shouldValidate: true,
    });
    form.setValue("address", data.address, {
      shouldValidate: true,
    });
    form.setValue("phone", data.phone ?? "", {
      shouldValidate: true,
    });
  };

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
              <Link href={ROUTES.SUPPLIERS}>{t("ui.label.suppliers")}</Link>
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
              name="taxCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.taxCode")}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder={t("ui.label.taxCode")}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <Button type="button" onClick={handleAutoFill}>
                      {t("ui.label.autoFill")}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("ui.label.name")}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="internationalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.internationalName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("ui.label.internationalName")}
                      {...field}
                      value={field.value ?? ""}
                    />
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
                    <Input
                      placeholder={t("ui.label.shortName")}
                      {...field}
                      value={field.value ?? ""}
                    />
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
                    <Input
                      placeholder={t("ui.label.address")}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.phone")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("ui.label.phone")}
                      {...field}
                      value={field.value ?? ""}
                    />
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
