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
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCallback, useEffect, useState } from "react";
import { DeviceType, DeviceModel, Asset, Supplier } from "@/types/data";
import { OS, WARRANTY } from "@/constants/config";

export default function EditAssetComponent({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();

  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const fetchDeviceModels = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/device-models`);
      const deviceModels: DeviceModel[] = res.data.data.deviceModels;

      setDeviceModels(deviceModels);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchDeviceTypes = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/device-types`);
      const deviceTypes: DeviceType[] = res.data.data.deviceTypes;

      setDeviceTypes(deviceTypes);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/suppliers`);
      const deviceTypes: Supplier[] = res.data.data.suppliers;

      setSuppliers(deviceTypes);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  useEffect(() => {
    fetchDeviceModels();
    fetchDeviceTypes();
    fetchSuppliers();
  }, []);

  const FormSchema = z.object({
    internalCode: z.string().min(1, {
      message: t("ui.message.internalCodeRequired"),
    }),
    serialNumber: z.string().min(1, {
      message: t("ui.message.serialNumberRequired"),
    }),
    deviceModelId: z.string().min(1, {
      message: t("ui.message.deviceModelRequired"),
    }),
    deviceTypeId: z.string().min(1, {
      message: t("ui.message.deviceTypeRequired"),
    }),
    supplierId: z.string().min(1, {
      message: t("ui.message.supplierRequired"),
    }),
    purchaseDate: z.date({
      required_error: t("ui.message.purchaseDateRequired"),
    }),
    warranty: z.string().min(1, {
      message: t("ui.message.warrantyRequired"),
    }),
    cpu: z.string().nullable(),
    ram: z.string().nullable(),
    hardDrive: z.string().nullable(),
    osType: z.string().nullable(),
    macAddress: z.string().nullable(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      internalCode: "",
      serialNumber: "",
      deviceModelId: "",
      deviceTypeId: "",
      supplierId: "",
      purchaseDate: undefined,
      warranty: "",
      cpu: null,
      ram: null,
      hardDrive: null,
      osType: null,
      macAddress: null,
    },
  });

  const fetchAsset = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/assets/${id}`);
      const data: Asset = res.data.data.asset;
      const { customProperties, ...rest } = data;
      form.reset({
        ...rest,
        purchaseDate: rest.purchaseDate
          ? new Date(rest.purchaseDate)
          : undefined,
        deviceModelId: rest.deviceModel?.id || "",
        deviceTypeId: rest.deviceType?.id || "",
        supplierId: rest.supplier?.id || "",
        warranty: rest.warranty !== undefined ? String(rest.warranty) : "",
        cpu: customProperties?.cpu || null,
        ram: customProperties?.ram || null,
        osType: customProperties?.osType || null,
        hardDrive: customProperties?.hardDrive || null,
        macAddress: customProperties?.macAddress || null,
      });
    } catch (err) {
      console.log(err);
      handleAxiosError(err);
    }
  }, [id, form]);

  useEffect(() => {
    fetchAsset();
  }, [fetchAsset]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { ram, cpu, hardDrive, osType, macAddress, warranty, ...rest } = data;
    try {
      const res = await axiosInstance.patch(`${ENV.API_URL}/assets/${id}`, {
        ...rest,
        warranty: parseInt(warranty),
        customProperties: {
          cpu,
          ram,
          osType,
          hardDrive,
          macAddress,
        },
      });
      handleAxiosSuccess(res);
      router.push(ROUTES.ASSETS);
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
              name="internalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.internalCode")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("ui.label.internalCode")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.serialNumber")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("ui.label.serialNumber")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deviceModelId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ui.label.deviceModel")}</FormLabel>
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
                            ? deviceModels.find(
                                (item) => item.id === field.value
                              )?.name
                            : t("ui.label.selectDeviceModel")}
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
                            {deviceModels.map((item) => (
                              <CommandItem
                                value={item.name}
                                key={item.id}
                                onSelect={() => {
                                  form.setValue("deviceModelId", item.id, {
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
              name="deviceTypeId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ui.label.deviceType")}</FormLabel>
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
                            ? deviceTypes.find(
                                (item) => item.id === field.value
                              )?.name
                            : t("ui.label.selectDeviceType")}
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
                            {deviceTypes.map((item) => (
                              <CommandItem
                                value={item.name}
                                key={item.id}
                                onSelect={() => {
                                  form.setValue("deviceTypeId", item.id, {
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
              name="supplierId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ui.label.supplier")}</FormLabel>
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
                            ? suppliers.find((item) => item.id === field.value)
                                ?.name
                            : t("ui.label.supplier")}
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
                            {suppliers.map((item) => (
                              <CommandItem
                                value={item.name}
                                key={item.id}
                                onSelect={() => {
                                  form.setValue("supplierId", item.id, {
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
              name="purchaseDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ui.label.purchaseDate")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            field.value.toLocaleDateString()
                          ) : (
                            <span>{t("ui.label.selectPurchaseDate")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                        defaultMonth={field.value}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="warranty"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ui.label.warranty")}</FormLabel>
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
                            ? WARRANTY.find((item) => item.id === field.value)
                                ?.name
                            : t("ui.label.selectWarranty")}
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
                            {WARRANTY.map((item) => (
                              <CommandItem
                                value={item.name}
                                key={item.id}
                                onSelect={() => {
                                  form.setValue("warranty", item.id, {
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
              name="cpu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.cpu")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("ui.label.cpu")}
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
              name="ram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.ram")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("ui.label.ram")}
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
              name="hardDrive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.hardDrive")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("ui.label.hardDrive")}
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
              name="osType"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ui.label.osType")}</FormLabel>
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
                            ? OS.find((item) => item.id === field.value)?.name
                            : t("ui.label.selectOsType")}
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
                            {OS.map((item) => (
                              <CommandItem
                                value={item.name}
                                key={item.id}
                                onSelect={() => {
                                  form.setValue("osType", item.id, {
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

            <Button type="submit">{t("ui.button.submit")}</Button>
          </form>
        </Form>
      </div>
    </SidebarInset>
  );
}
