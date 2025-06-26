// "use client"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { TFunction } from "i18next";
import { MAX_VISIBLE_PAGES } from "@/constants/config";

interface PaginationProps {
  t: TFunction<"translation", undefined>;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  getPageNumbers: () => (number | string)[];
}
export default function Pagination({
  t,
  currentPage,
  totalPages,
  goToPage,
  getPageNumbers,
}: PaginationProps) {
  return (
    <>
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4 w-full">
          <div className="text-sm text-gray-600">
            {t("ui.label.page")} {currentPage} / {totalPages}
          </div>

          <div className="flex flex-wrap items-center justify-start gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("ui.button.previous")}
            </Button>

            <div className="flex flex-wrap items-center gap-1">
              {getPageNumbers().map((page, index) => (
                <div key={index}>
                  {page === "..." ? (
                    <span className="px-3 py-2 text-gray-400">...</span>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page as number)}
                      className="min-w-[36px] px-2 flex-shrink-0"
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
              className="flex-shrink-0"
            >
              {t("ui.button.next")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

interface getPageNumbersProps {
  totalPages: number;
  currentPage: number;
}

export function getPageNumbers({
  totalPages,
  currentPage,
}: getPageNumbersProps) {
  const pages = [];

  if (totalPages <= MAX_VISIBLE_PAGES) {
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
}
