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
import { MoreHorizontal } from "lucide-react";
import { DeviceType } from "@/types/data";
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
import { DeleteIcon, EditIcon, EyeIcon } from "@/components/icon/icon";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { ITEMS_PER_PAGE } from "@/constants/config";
import LoadingDot from "@/components/loading-dot";

import Pagination, { getPageNumbers } from "@/components/pagination";
import GenericModal from "@/components/modal";
import SearchComponent from "@/components/search";

export default function DeviceTypesComponent() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<DeviceType>();
  const [openGenericModal, setOpenGenericModal] = useState(false);

  const handleOpenGenericModal = (item: DeviceType) => {
    setSelectedItem(item);
    setOpenGenericModal(true);
  };

  const fetchDeviceTypes = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/device-types`);
      setDeviceTypes(res.data.data.deviceTypes);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  // ✅ Hàm update URL theo thứ tự: page -> search
  const updateURL = useCallback(
    (newSearch: string, newPage: number) => {
      const params = new URLSearchParams();
      const page = newPage > 0 ? newPage : 1;

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
    const pageParam = searchParams.get("page");
    const searchParam = searchParams.get("search") ?? "";

    const pageToSet =
      pageParam && Number(pageParam) > 0 ? Number(pageParam) : 1;

    if (!pageParam) {
      const params = new URLSearchParams();
      params.set("page", "1");
      if (searchParam) params.set("search", searchParam);

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(url, { scroll: false });
      return;
    }

    setCurrentPage(pageToSet);
    setSearchInput(searchParam);
    setSearchQuery(searchParam);
    updateURL(searchParam, pageToSet);
  }, [searchParams, pathname, router, updateURL]);

  // Lọc dữ liệu dựa trên từ khóa tìm kiếm
  const filteredData = useMemo(() => {
    if (!searchQuery) return deviceTypes;
    const keyword = searchQuery.toLowerCase();

    return deviceTypes.filter((item) =>
      item.name?.toLowerCase().includes(keyword)
    );
  }, [searchQuery, deviceTypes]);

  // Tính toán phân trang
  const length = filteredData.length;
  const totalPages = Math.ceil(length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset về trang 1 khi tìm kiếm
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
    updateURL(searchInput, 1);
  };

  // Chuyển trang
  const goToPage = (page: number) => {
    setCurrentPage(page);
    updateURL(searchQuery, page);
  };

  const handleDelete = async (item: DeviceType) => {
    const name = item.name;
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
            `${ENV.API_URL}/device-types/${item.id}`
          );
          handleAxiosSuccess(res);
          setDeviceTypes((prev) => prev.filter((o) => o.id !== item.id));

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
            <BreadcrumbItem>
              <BreadcrumbPage>{t("ui.label.deviceTypes")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="w-full mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-2xl font-bold">
              <p>{t("ui.label.deviceTypes")}</p>
              <Button>
                <Link href={ROUTES.DEVICE_TYPE_ADD}>{t("ui.button.add")}</Link>
              </Button>
            </CardTitle>
            <SearchComponent
              t={t}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              length={length}
              startIndex={startIndex}
              endIndex={endIndex}
              handleSearch={handleSearch}
            />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <p className="text-wrap min-w-40">{t("ui.label.name")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap">{t("ui.label.actions")}</p>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.length > 0 ? (
                    currentData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <p className="text-wrap">{item.name}</p>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only"></span>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                              <DropdownMenuGroup>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleOpenGenericModal(item)}
                                >
                                  {t("ui.button.view")}
                                  <DropdownMenuShortcut>
                                    <EyeIcon />
                                  </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <Link href={ROUTES.DEVICE_TYPE_EDIT(item.id)}>
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

            <Pagination
              t={t}
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
              getPageNumbers={() => getPageNumbers({ totalPages, currentPage })}
            />
          </CardContent>
        </Card>
      </div>

      <GenericModal
        open={openGenericModal}
        setOpen={setOpenGenericModal}
        t={t}
        title={t("ui.label.deviceType")}
        fields={[{ label: t("ui.label.name"), value: selectedItem?.name }]}
      />
    </SidebarInset>
  );
}
