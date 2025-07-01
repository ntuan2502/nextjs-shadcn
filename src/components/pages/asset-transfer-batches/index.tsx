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
import { AssetTransferBatch } from "@/types/data";
import axiosInstance from "@/lib/axiosInstance";
import { ENV, ROUTES } from "@/constants";
import { handleAxiosError } from "@/lib/handleAxiosFeedback";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmIcon, EyeIcon, FileIcon } from "@/components/icon/icon";
import { useTranslation } from "react-i18next";
import { ITEMS_PER_PAGE } from "@/constants/config";
import LoadingDot from "@/components/loading-dot";
import dayjs from "dayjs";
import { TransactionDirection } from "@/types/enum";
import Pagination, { getPageNumbers } from "@/components/pagination";
import SearchComponent from "@/components/search";
import GenericModal from "@/components/modal";

export default function AssetTransferBatchesComponent() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [assetTransferBatches, setAssetTransferBatches] = useState<
    AssetTransferBatch[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<AssetTransferBatch>();
  const [openGenericModal, setOpenGenericModal] = useState(false);

  const handleOpenGenericModal = (item: AssetTransferBatch) => {
    setSelectedItem(item);
    setOpenGenericModal(true);
  };

  const fetchAssetTransferBatches = async () => {
    try {
      const res = await axiosInstance.get(
        `${ENV.API_URL}/asset-transfer-batches`
      );
      setAssetTransferBatches(res.data.data.assetTransferBatches);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetTransferBatches();
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
    if (!searchQuery) return assetTransferBatches;
    const keyword = searchQuery.toLowerCase();

    return assetTransferBatches.filter(
      (item) =>
        item.note?.toLowerCase().includes(keyword) ||
        dayjs(item.createdAt).format("HH:mm:ss YYYY-MM-DD").includes(keyword)
    );
  }, [searchQuery, assetTransferBatches]);

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
              <BreadcrumbPage>
                {t("ui.label.assetTransferBatches")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="w-full mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-2xl font-bold">
              <p>{t("ui.label.assetTransferBatches")}</p>
              {/* <Button>
                <Link href={ROUTES.ASSET_TRANSACTIONS}>{t("ui.button.add")}</Link>
              </Button> */}
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
                      <p className="text-wrap min-w-40">{t("ui.label.id")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap min-w-40">{t("ui.label.data")}</p>
                    </TableHead>
                    <TableHead>
                      <p className="text-wrap min-w-40">{t("ui.label.note")}</p>
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
                          <p className="text-wrap">{item.id}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-wrap">
                            {item.assetTransactions
                              .filter(
                                (tx) =>
                                  tx.direction === TransactionDirection.INCOMING
                              )
                              .map((tx) => tx.asset?.internalCode ?? "")
                              .join(", ")}
                          </p>
                        </TableCell>

                        <TableCell>
                          <p className="text-wrap">{item.note}</p>
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
                                <DropdownMenuSeparator />
                                {item.assetTransactions.some(
                                  (tx) => tx.status === "PENDING"
                                ) && (
                                  <Link
                                    href={ROUTES.ASSET_TRANSFER_BATCH_CONFIRM(
                                      item.id
                                    )}
                                  >
                                    <DropdownMenuItem className="cursor-pointer">
                                      {t("ui.button.confirm")}
                                      <DropdownMenuShortcut>
                                        <ConfirmIcon />
                                      </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                  </Link>
                                )}
                                {item.handover && (
                                  <Link
                                    href={ENV.API_URL + item.handover.filePath}
                                    target="_blank"
                                  >
                                    <DropdownMenuItem className="cursor-pointer">
                                      {t("ui.button.handover")}
                                      <DropdownMenuShortcut>
                                        <FileIcon />
                                      </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                  </Link>
                                )}
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
        title={t("ui.label.department")}
        fields={[
          { label: t("ui.label.id"), value: selectedItem?.id },
          {
            label: t("ui.label.data"),
            value: selectedItem?.assetTransactions
              .filter((tx) => tx.direction === TransactionDirection.INCOMING)
              .map((tx) => tx.asset?.internalCode ?? "")
              .join(", "),
          },
          { label: t("ui.label.note"), value: selectedItem?.note },
        ]}
      />
    </SidebarInset>
  );
}
