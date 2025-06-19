import { ROUTES } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={ROUTES.HOMEPAGE} className="z-10">
      <div className="relative w-[150px] h-[60px]">
        <Image
          src="/logo/AMATAVN.svg"
          alt="Logo"
          fill
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
    </Link>
  );
}
