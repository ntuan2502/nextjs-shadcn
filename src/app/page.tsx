"use client";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <BackgroundBeamsWithCollision>
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-2xl font-bold">Welcome to the Next.js App!</h1>
          <Button asChild>
            <Link href="/admin/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
