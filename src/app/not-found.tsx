"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {t("ui.label.pageNotFound")}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t("ui.label.pageNotFoundDescription")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              {t("ui.label.goHome")}
            </Link>
          </Button>

          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("ui.label.goBack")}
          </Button>
        </div>

        {/* <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for something specific?
          </p>
          <Button variant="ghost" asChild>
            <Link href="/search">
              <Search className="w-4 h-4 mr-2" />
              Search our site
            </Link>
          </Button>
        </div> */}
      </div>
    </div>
  );
}
