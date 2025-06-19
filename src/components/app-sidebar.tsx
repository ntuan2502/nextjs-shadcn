"use client";

import { useEffect, useState } from "react";
import {
  GalleryVerticalEnd,
  Home,
  Settings,
  Folder,
  ChevronDown,
  UserIcon,
  ChevronsUpDown,
  LogOut,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { PreferencesMenu } from "@/components/preferences-menu";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/auth";
import { ROUTES } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Navigation data with translation keys
  const data = {
    navMain: [
      {
        title: t("ui.label.dashboard"),
        url: "#",
        icon: Home,
        items: [
          {
            title: t("ui.label.dashboard"),
            url: ROUTES.ADMIN_DASHBOARD,
            icon: Folder,
          },
          {
            title: t("ui.label.settings"),
            url: ROUTES.SETTINGS,
            icon: Settings,
          },
          {
            title: t("ui.label.users"),
            url: ROUTES.USERS,
            icon: User,
          },
        ],
      },
    ],
  };

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  //Mobile
  const SheetMenuItems = () => (
    <div className="flex flex-col">
      {user && (
        <div className="flex items-center gap-3 p-4 border-b">
          <Avatar className="h-12 w-12 rounded-lg">
            {user.avatar && (
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
              />
            )}
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{user.name}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      )}

      <div className="p-2 space-y-1">
        <button className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
          <UserIcon className="mr-3 h-4 w-4" />
          {t("ui.label.account")}
        </button>
        <Separator className="my-2" />
        <PreferencesMenu />
        <Separator className="my-2" />
        <button
          className="flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 cursor-pointer"
          onClick={logout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          {t("ui.label.logout")}
        </button>
      </div>
    </div>
  );

  const DropdownMenuItems = () => (
    <>
      {user && (
        <div className="flex items-center gap-3 p-4 border-b">
          <Avatar className="h-12 w-12 rounded-lg">
            {user.avatar && (
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
              />
            )}
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{user.name}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      )}
      <div className="p-2 space-y-1">
        <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer">
          <UserIcon className="mr-3 h-4 w-4" />
          {t("ui.label.account")}
        </DropdownMenuItem>
        <Separator className="my-2" />
        <PreferencesMenu />
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
          onClick={logout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          {t("ui.label.logout")}
        </DropdownMenuItem>
      </div>
    </>
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">{t("ui.label.amata")}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="sidebar-scrollable">
        {data.navMain.map((item, index) => (
          <Collapsible
            key={index}
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-2 text-sm cursor-pointer">
                  <item.icon className="size-4" />
                  <span>{t(item.title)}</span>
                  <ChevronDown className="ml-auto size-4 transition-transform -rotate-90 group-data-[state=open]/collapsible:rotate-0" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname.includes(subItem.url)}
                        >
                          <Link
                            href={subItem.url}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <subItem.icon className="size-4" />
                            <span>{t(subItem.title)}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  {user && (
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        {user.avatar && (
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                          />
                        )}
                        <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.name}
                        </span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  )}
                </SheetTrigger>
                <SheetContent side="bottom" className="h-auto max-h-[70vh] p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                  </SheetHeader>
                  <SheetMenuItems />
                </SheetContent>
              </Sheet>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {user && (
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        {user.avatar && (
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                          />
                        )}
                        <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.name}
                        </span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-full min-w-56 rounded-lg p-0"
                  side="right"
                  align="center"
                  sideOffset={8}
                >
                  <DropdownMenuItems />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
