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
import { useState, useMemo, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { Asset, Office } from "@/types/data";
import axiosInstance from "@/lib/axiosInstance";
import { ENV, ROUTES } from "@/constants";
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/lib/handleAxiosFeedback";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DeleteIcon,
  EditIcon,
  EyeIcon,
  FilePlusIcon,
} from "@/components/icon/icon";
import { useTranslation } from "react-i18next";
import { ITEMS_PER_PAGE } from "@/constants/config";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import LoadingDot from "@/components/loading-dot";

export default function AssetsComponent() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [offices, setOffices] = useState<Office[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [tabSelected, setTabSelected] = useState<string>("");

  const fetchOffices = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/offices`);
      setOffices(res.data.data.offices);
    } catch (err) {
      handleAxiosError(err);
    }
  };
  const fetchAssets = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/assets`);
      setAssets(res.data.data.assets);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
    fetchAssets();
  }, []);

  // ✅ Hàm update URL theo thứ tự: page -> search
  const updateURL = useCallback(
    (officeId: string, newSearch: string, newPage: number) => {
      const params = new URLSearchParams();
      const page = newPage > 0 ? newPage : 1;

      if (officeId) params.set("office", officeId);
      params.set("page", page.toString());
      if (newSearch) params.set("search", newSearch);

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(url, { scroll: false });
    },
    [pathname, router]
  );

  // ✅ Đồng bộ state với URL (theo thứ tự page -> search)
  useEffect(() => {
    const officeParam = searchParams.get("office");
    const pageParam = searchParams.get("page");
    const searchParam = searchParams.get("search") ?? "";

    // const fallbackOfficeId = offices.length > 0 ? offices[0].id : "";
    // const officeToSet = officeParam ?? fallbackOfficeId;
    const officeToSet = officeParam || "";

    const pageToSet =
      pageParam && Number(pageParam) > 0 ? Number(pageParam) : 1;

    setTabSelected(officeToSet);
    setCurrentPage(pageToSet);
    setSearchInput(searchParam);
    setSearchQuery(searchParam);
    updateURL(officeToSet, searchParam, pageToSet);
  }, [searchParams, pathname, router, updateURL, offices]);

  // Lọc dữ liệu dựa trên từ khóa tìm kiếm
  const filteredData = useMemo(() => {
    const keyword = searchQuery.toLowerCase();
    return assets.filter((item) => {
      const matchesSearch =
        item.internalCode?.toLowerCase().includes(keyword) ||
        item.serialNumber.toLowerCase().includes(keyword) ||
        item.deviceModel?.name.toLowerCase().includes(keyword) ||
        item.deviceType?.name.toLowerCase().includes(keyword) ||
        item.assetTransactions?.[0]?.user?.name
          ?.toLowerCase()
          .includes(keyword) ||
        item.assetTransactions?.[0]?.user?.department?.name
          ?.toLowerCase()
          .includes(keyword) ||
        item.customProperties?.cpu?.toLowerCase().includes(keyword) ||
        item.customProperties?.ram?.toLowerCase().includes(keyword) ||
        item.customProperties?.osType?.toLowerCase().includes(keyword) ||
        item.customProperties?.hardDrive?.toLowerCase().includes(keyword) ||
        item.customProperties?.macAddress?.toLowerCase().includes(keyword);

      if (!tabSelected) return matchesSearch;

      const belongsToSelectedOffice =
        item.assetTransactions?.[0]?.user?.office?.id === tabSelected;
      return belongsToSelectedOffice && matchesSearch;
    });
  }, [searchQuery, assets, tabSelected]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleOfficeChange = (officeId: string) => {
    setTabSelected(officeId);
    setCurrentPage(1);
    updateURL(officeId, searchQuery, 1);
    setOpen(false);
  };

  // Reset về trang 1 khi tìm kiếm
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
    updateURL(tabSelected, searchInput, 1);
  };

  // Chuyển trang
  const goToPage = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      updateURL(tabSelected, searchQuery, page);
    }
  };

  // Tạo danh sách số trang
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleDelete = async (item: Asset) => {
    const name = item.internalCode;
    Swal.fire({
      title: t("ui.swal.title", { name }),
      text: t("ui.swal.text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("ui.swal.confirmButtonText"),
      cancelButtonText: t("ui.swal.cancelButtonText"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosInstance.delete(
            `${ENV.API_URL}/assets/${item.id}`
          );
          handleAxiosSuccess(res);
          setAssets((prev) => prev.filter((o) => o.id !== item.id));

          Swal.fire({
            title: t("ui.swal.confirmed.title"),
            text: t("ui.swal.confirmed.text", { name }),
            icon: "success",
          });
        } catch (err) {
          handleAxiosError(err);
        }
      }
    });
  };

  if (isLoading) return <LoadingDot />;

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
              <BreadcrumbPage>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="justify-between"
                    >
                      {tabSelected
                        ? offices.find((office) => office.id === tabSelected)
                            ?.shortName
                        : t("ui.label.selectOffice")}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
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
                              key={office.id}
                              value={office.id}
                              onSelect={handleOfficeChange}
                            >
                              {office.shortName}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  tabSelected === office.id
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
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="w-full mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-2xl font-bold">
              <p>{t("ui.label.assets")}</p>
              <Button>
                <Link href={ROUTES.ASSET_ADD}>{t("ui.button.add")}</Link>
              </Button>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("ui.placeholder.search")}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
              <Button variant="outline" onClick={handleSearch}>
                {t("ui.button.search")}
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              {t("ui.message.showingProducts", {
                from: startIndex + 1,
                to: Math.min(endIndex, filteredData.length),
                total: filteredData.length,
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.internalCode")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.deviceModel")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.serialNumber")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.user")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.department")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.cpu")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.ram")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.hardDrive")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.osType")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">
                        {t("ui.label.transactionType")}
                      </p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.purchaseDate")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.warranty")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.endOfWarranty")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.endOfLife")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.actions")}</p>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.length > 0 ? (
                    currentData.map((item) => (
                      <TableRow
                        key={item.id}
                        className={
                          dayjs(item.purchaseDate)
                            .add(item.warranty || 3, "year")
                            .format("YYYY-MM-DD") <=
                          dayjs().format("YYYY-MM-DD")
                            ? dayjs(item.purchaseDate)
                                .add(5, "year")
                                .format("YYYY-MM-DD") <=
                              dayjs().format("YYYY-MM-DD")
                              ? "bg-red-400"
                              : "bg-blue-400"
                            : ""
                        }
                      >
                        <TableCell>
                          <p>{item.internalCode}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">{item.deviceModel?.name}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">{item.serialNumber}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">
                            {item.assetTransactions?.[0]?.user?.name}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">
                            {
                              item.assetTransactions?.[0]?.user?.department
                                ?.name
                            }
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">
                            {item.customProperties?.cpu}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">
                            {item.customProperties?.ram}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">
                            {item.customProperties?.hardDrive}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">
                            {item.customProperties?.osType}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">
                            {item.assetTransactions?.[0]?.type}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">
                            {dayjs(item.purchaseDate).format("YYYY-MM-DD")}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">{item.warranty}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">
                            {dayjs(item.purchaseDate)
                              .add(item.warranty || 3, "year")
                              .format("YYYY-MM-DD")}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">
                            {dayjs(item.purchaseDate)
                              .add(5, "year")
                              .format("YYYY-MM-DD")}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                              <DropdownMenuGroup>
                                <Link
                                  href={ROUTES.ASSET_CREATE_REQUEST(item.id)}
                                >
                                  <DropdownMenuItem className="cursor-pointer">
                                    {t("ui.button.createRequest")}
                                    <DropdownMenuShortcut>
                                      <FilePlusIcon />
                                    </DropdownMenuShortcut>
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem className="cursor-pointer">
                                  {t("ui.button.view")}
                                  <DropdownMenuShortcut>
                                    <EyeIcon />
                                  </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <Link href={ROUTES.ASSET_EDIT(item.id)}>
                                  <DropdownMenuItem className="cursor-pointer">
                                    {t("ui.button.edit")}
                                    <DropdownMenuShortcut>
                                      <EditIcon />
                                    </DropdownMenuShortcut>
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
                                  onClick={() => handleDelete(item)}
                                >
                                  {t("ui.button.delete")}
                                  <DropdownMenuShortcut>
                                    <DeleteIcon />
                                  </DropdownMenuShortcut>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        {t("ui.message.searchNoResults", { searchQuery })}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  {t("ui.label.page")} {currentPage} / {totalPages}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t("ui.button.previous")}
                  </Button>

                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((page, index) => (
                      <div key={index}>
                        {page === "..." ? (
                          <span className="px-3 py-2 text-gray-400">...</span>
                        ) : (
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => goToPage(page as number)}
                            className="min-w-[40px]"
                          >
                            {page}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    {t("ui.button.next")}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
