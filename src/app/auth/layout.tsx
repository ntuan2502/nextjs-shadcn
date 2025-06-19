import AppNavbar from "@/components/app-navbar";

export default function NavbarDemo({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppNavbar>{children}</AppNavbar>
    </>
  );
}
