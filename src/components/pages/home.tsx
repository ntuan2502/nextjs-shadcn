"use client";

import { PreferencesMenu } from "@/components/preferences-menu";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AppNavbar from "@/components/app-navbar";
import { ROUTES } from "@/constants";

export default function HomeComponent() {
  return (
    <>
      <AppNavbar>
        <BackgroundBeamsWithCollision>
          <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-2xl font-bold">
                Welcome to the Next.js App!
              </h1>
              <Button asChild>
                <Link href={ROUTES.ADMIN_DASHBOARD}>Go to dashboard</Link>
              </Button>
              <Button asChild>
                <Link href={ROUTES.AUTH_LOGIN}>Login</Link>
              </Button>
              <PreferencesMenu />
            </div>
          </div>
        </BackgroundBeamsWithCollision>
      </AppNavbar>
    </>
  );
}
