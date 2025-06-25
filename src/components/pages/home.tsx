"use client";

import { PreferencesMenu } from "@/components/preferences-menu";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AppNavbar from "@/components/app-navbar";
import { ROUTES } from "@/constants";
import { useTranslation } from "react-i18next";

export default function HomeComponent() {
  const { t } = useTranslation();
  return (
    <>
      <AppNavbar>
        <BackgroundBeamsWithCollision>
          <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-2xl font-bold">{t("ui.label.welcome")}</h1>
              <Button asChild>
                <Link href={ROUTES.AUTH_LOGIN}>{t("ui.label.login")}</Link>
              </Button>
              <PreferencesMenu />
            </div>
          </div>
        </BackgroundBeamsWithCollision>
      </AppNavbar>
    </>
  );
}
