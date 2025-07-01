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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCallback, useEffect, useState } from "react";
import { Department, Office, User } from "@/types/data";
import { FEMALE, MALE } from "@/constants/config";

export default function EditUserComponent({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();

  const [offices, setOffices] = useState<Office[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchOffices = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/offices`);
      const offices: Office[] = res.data.data.offices;

      setOffices(offices);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/departments`);
      const departments: Department[] = res.data.data.departments;

      setDepartments(departments);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  useEffect(() => {
    fetchOffices();
    fetchDepartments();
  }, []);

  const FormSchema = z.object({
    email: z.string().min(1, {
      message: t("ui.message.emailRequired"),
    }),
    name: z.string().min(1, {
      message: t("ui.message.nameRequired"),
    }),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    avatar: z.string().nullable(),
    dob: z.date().nullable(),
    gender: z.enum([MALE, FEMALE], {
      required_error: t("ui.message.genderRequired"),
    }),
    officeId: z.string().nullable(),
    departmentId: z.string().nullable(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: null,
      address: null,
      avatar: null,
      dob: null,
      gender: MALE,
      officeId: null,
      departmentId: null,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await axiosInstance.patch(`${ENV.API_URL}/users/${id}`, {
        ...data,
      });
      handleAxiosSuccess(res);
      router.push(ROUTES.USERS);
    } catch (err) {
      handleAxiosError(err);
    }
  }

  const fetchUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/users/${id}`);
      const data: User = res.data.data.user;
      const { dob, ...rest } = data;
      const date = new Date(dob);
      form.reset({
        ...rest,
        dob: date,
        officeId: rest.office?.id || null,
        departmentId: rest.department?.id || null,
      });
      console.log(data);
    } catch (err) {
      handleAxiosError(err);
    }
  }, [id, form]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
              <Link href={ROUTES.USERS}>{t("ui.label.users")}</Link>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("ui.label.email")} {...field} />
                  </FormControl>
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
                    <Input placeholder={t("ui.label.name")} {...field} />
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
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ui.label.avatar")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("ui.label.avatar")}
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
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ui.label.dob")}</FormLabel>
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
                            <span>{t("ui.label.pickDate")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                        defaultMonth={field.value ?? undefined}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t("ui.label.gender")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row"
                    >
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value={MALE} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t("ui.label.male")}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value={FEMALE} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t("ui.label.female")}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="officeId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ui.label.office")}</FormLabel>
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
                            ? offices.find(
                                (office) => office.id === field.value
                              )?.name
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
                            {offices.map((office) => (
                              <CommandItem
                                value={office.name}
                                key={office.id}
                                onSelect={() => {
                                  form.setValue("officeId", office.id, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                {office.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    office.id === field.value
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
                  <FormLabel>{t("ui.label.department")}</FormLabel>
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
                                (department) => department.id === field.value
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
                            {departments.map((department) => (
                              <CommandItem
                                value={department.name}
                                key={department.id}
                                onSelect={() => {
                                  form.setValue("departmentId", department.id, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                {department.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    department.id === field.value
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
