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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { base64ToFile, cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCallback, useEffect, useState } from "react";
import { Asset, Office, Department, User } from "@/types/data";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ReactSignature } from "@/components/react-signature";
import { toast } from "react-toastify";
import { TransactionType } from "@/types/enum";

export default function CreateRequestAssetAdminComponent({
  id,
}: {
  id: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchAssets = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/assets`);
      const data: Asset[] = res.data.data.assets;

      setAssets(data);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchOffices = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/offices`);
      const data: Office[] = res.data.data.offices;

      setOffices(data);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/departments`);
      const data: Department[] = res.data.data.departments;

      setDepartments(data);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/users`);
      const data: User[] = res.data.data.users;

      setUsers(data);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  useEffect(() => {
    fetchAssets();
    fetchOffices();
    fetchDepartments();
    fetchUsers();
  }, []);

  const FormSchema = z.object({
    internalCode: z.string().min(1, {
      message: t("ui.message.internalCodeRequired"),
    }),
    assetID: z.string().min(1, t("ui.message.assetRequired")),
    relatedAssetsID: z.array(z.string()).optional(),
    officeId: z.string().min(1, t("ui.message.officeRequired")),
    departmentId: z.string().min(1, {
      message: t("ui.message.departmentRequired"),
    }),
    fromUserId: z.string().min(1, {
      message: t("ui.message.fromUserRequired"),
    }),
    toUserId: z.string().min(1, {
      message: t("ui.message.toUserRequired"),
    }),
    note: z.string().optional(),
    signature: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      internalCode: "",
      assetID: "",
      relatedAssetsID: [],
      officeId: "",
      departmentId: "",
      fromUserId: "",
      toUserId: "",
      note: "",
      signature: "",
    },
  });

  const fetchAsset = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/assets/${id}`);
      const data: Asset = res.data.data.asset;
      form.setValue("internalCode", data.internalCode, {
        shouldValidate: true,
      });
      form.setValue("assetID", data.id, { shouldValidate: true });
    } catch (err) {
      console.log(err);
      handleAxiosError(err);
    }
  }, [id, form]);

  useEffect(() => {
    fetchAsset();
  }, [fetchAsset]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!data.signature) return toast.error(t("ui.label.noSignature"));
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("assetId", data.assetID);
      formDataToSend.append("officeId", data.officeId);
      formDataToSend.append("departmentId", data.departmentId);
      formDataToSend.append("fromUserId", data.fromUserId);
      formDataToSend.append("toUserId", data.toUserId);
      formDataToSend.append("type", TransactionType.TRANSFER);
      formDataToSend.append("note", data.note || "");
      Array.from(data.relatedAssetsID ?? []).forEach((assetId) => {
        formDataToSend.append("relatedAssets[]", assetId);
      });

      if (data.signature) {
        const file = base64ToFile(data.signature, "signature.png");
        formDataToSend.append("fromSignature", file);
      }

      const res = await axiosInstance.post(
        `${ENV.API_URL}/asset-transactions/create-request`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      handleAxiosSuccess(res);
      router.push(ROUTES.ASSET_TRANSACTIONS);
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
              <Link href={ROUTES.ASSETS}>{t("ui.label.assets")}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("ui.button.createRequest")}</BreadcrumbPage>
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
              name="internalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.internalCode")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("ui.label.internalCode")}
                      {...field}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relatedAssetsID"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ui.label.relatedAssets")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            field.value?.length === 0 && "text-muted-foreground"
                          )}
                        >
                          {field.value && field.value.length > 0
                            ? t("ui.label.itemsSelected", {
                                count: field.value.length,
                              })
                            : t("ui.label.selectRelatedAssets")}
                          <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[300px]">
                      <Command>
                        <CommandInput
                          placeholder={t("ui.label.search")}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>{t("ui.label.noData")}</CommandEmpty>
                          <CommandGroup>
                            {assets
                              .filter((item) => item.id !== id)
                              .map((item) => {
                                const selected = field.value?.includes(item.id);
                                return (
                                  <CommandItem
                                    key={item.id}
                                    value={item.internalCode}
                                    onSelect={() => {
                                      const newValue = selected
                                        ? field.value?.filter(
                                            (id) => id !== item.id
                                          )
                                        : [...(field.value ?? []), item.id];

                                      form.setValue(
                                        "relatedAssetsID",
                                        newValue,
                                        {
                                          shouldValidate: true,
                                        }
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selected ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {item.internalCode}
                                  </CommandItem>
                                );
                              })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((id) => {
                      const asset = assets.find((a) => a.id === id);
                      if (!asset) return null;
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="flex items-center gap-1 pr-1"
                        >
                          {asset.internalCode}
                          <button
                            className="cursor-pointer hover:text-destructive"
                            onClick={() => {
                              const newValue = field.value?.filter(
                                (val) => val !== id
                              );
                              form.setValue("relatedAssetsID", newValue, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <X className="h-3 w-3 " />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="officeId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ui.label.offices")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? offices.find((item) => item.id === field.value)
                                ?.name
                            : t("ui.label.selectOffice")}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder={t("ui.label.search")}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>{t("ui.label.noData")}</CommandEmpty>
                          <CommandGroup>
                            {offices.map((item) => (
                              <CommandItem
                                value={item.name}
                                key={item.id}
                                onSelect={() => {
                                  form.setValue("officeId", item.id, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                {item.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    item.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ui.label.departments")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? departments.find(
                                (item) => item.id === field.value
                              )?.name
                            : t("ui.label.selectDepartment")}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder={t("ui.label.search")}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>{t("ui.label.noData")}</CommandEmpty>
                          <CommandGroup>
                            {departments.map((item) => (
                              <CommandItem
                                value={item.name}
                                key={item.id}
                                onSelect={() => {
                                  form.setValue("departmentId", item.id, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                {item.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    item.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromUserId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ui.label.fromUser")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? users.find((item) => item.id === field.value)
                                ?.name
                            : t("ui.label.selectFromUser")}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder={t("ui.label.search")}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>{t("ui.label.noData")}</CommandEmpty>
                          <CommandGroup>
                            {users.map((item) => (
                              <CommandItem
                                value={item.name}
                                key={item.id}
                                onSelect={() => {
                                  form.setValue("fromUserId", item.id, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                {item.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    item.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toUserId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ui.label.toUser")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? users.find((item) => item.id === field.value)
                                ?.name
                            : t("ui.label.selectToUser")}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder={t("ui.label.search")}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>{t("ui.label.noData")}</CommandEmpty>
                          <CommandGroup>
                            {users.map((item) => (
                              <CommandItem
                                value={item.name}
                                key={item.id}
                                onSelect={() => {
                                  form.setValue("toUserId", item.id, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                {item.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    item.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.note")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ReactSignature
              className="max-w-96"
              label={t("ui.label.signature")}
              onDownload={(url) => form.setValue("signature", url)}
            />

            <Button type="submit">{t("ui.button.submit")}</Button>
          </form>
        </Form>
      </div>
    </SidebarInset>
  );
}
