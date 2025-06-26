import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TFunction } from "i18next";

interface SearchProps {
  t: TFunction<"translation", undefined>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  length: number;
  startIndex: number;
  endIndex: number;
  handleSearch: () => void;
}

export default function SearchComponent({
  t,
  searchInput,
  setSearchInput,
  length,
  startIndex,
  endIndex,
  handleSearch,
}: SearchProps) {
  return (
    <>
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
        {t("ui.message.showingResults", {
          from: startIndex + 1,
          to: Math.min(endIndex, length),
          total: length,
        })}
      </div>
    </>
  );
}
