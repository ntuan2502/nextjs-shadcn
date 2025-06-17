"use client";

import type * as React from "react";
import { useEffect, useState } from "react";
import {
  GalleryVerticalEnd,
  Home,
  BookOpen,
  Code,
  Settings,
  FileText,
  Folder,
  Zap,
  Database,
  ChevronDown,
  Eye,
  Cpu,
  Users,
  UserIcon,
  Shield,
  Mail,
  Activity,
  GitBranch,
  Rocket,
  Key,
  Webhook,
  BarChart,
  TrendingUp,
  Target,
  MousePointer,
  Megaphone,
  Send,
  Share2,
  Search,
  DollarSign,
  Receipt,
  Calendar,
  BellIcon,
  Plug,
  Check,
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
import { ChevronsUpDown, Crown, CreditCard, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { PreferencesMenu } from "./preferences-menu";
import { useTranslation } from "react-i18next";

const userData = {
  name: "John Doe",
  email: "john@amata.com",
  avatar: null,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  // Navigation data with translation keys
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "#",
        icon: Home,
        items: [
          {
            title: "Overview",
            url: "#",
            icon: Eye,
          },
          {
            title: "Analytics",
            url: "#",
            icon: Database,
          },
          {
            title: "Reports",
            url: "#",
            icon: FileText,
          },
        ],
      },
      {
        title: "Projects",
        url: "#",
        icon: Folder,
        items: [
          {
            title: "All Projects",
            url: "#",
            icon: Folder,
          },
          {
            title: "Active Projects",
            url: "#",
            icon: Zap,
            isActive: true,
          },
          {
            title: "Completed",
            url: "#",
            icon: Check,
          },
          {
            title: "Templates",
            url: "#",
            icon: FileText,
          },
        ],
      },
      {
        title: "Team",
        url: "#",
        icon: Users,
        items: [
          {
            title: "Members",
            url: "#",
            icon: UserIcon,
          },
          {
            title: "Roles & Permissions",
            url: "#",
            icon: Shield,
          },
          {
            title: "Invitations",
            url: "#",
            icon: Mail,
          },
          {
            title: "Activity",
            url: "#",
            icon: Activity,
          },
        ],
      },
      {
        title: "Development",
        url: "#",
        icon: Code,
        items: [
          {
            title: "Repositories",
            url: "#",
            icon: GitBranch,
          },
          {
            title: "Deployments",
            url: "#",
            icon: Rocket,
          },
          {
            title: "API Keys",
            url: "#",
            icon: Key,
          },
          {
            title: "Webhooks",
            url: "#",
            icon: Webhook,
          },
          {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
          },
        ],
      },
      {
        title: "Analytics",
        url: "#",
        icon: BarChart,
        items: [
          {
            title: "Traffic",
            url: "#",
            icon: TrendingUp,
          },
          {
            title: "Performance",
            url: "#",
            icon: Cpu,
          },
          {
            title: "Conversion",
            url: "#",
            icon: Target,
          },
          {
            title: "User Behavior",
            url: "#",
            icon: MousePointer,
          },
        ],
      },
      {
        title: "Marketing",
        url: "#",
        icon: Megaphone,
        items: [
          {
            title: "Campaigns",
            url: "#",
            icon: Send,
          },
          {
            title: "Email Lists",
            url: "#",
            icon: Mail,
          },
          {
            title: "Social Media",
            url: "#",
            icon: Share2,
          },
          {
            title: "SEO Tools",
            url: "#",
            icon: Search,
          },
        ],
      },
      {
        title: "Finance",
        url: "#",
        icon: DollarSign,
        items: [
          {
            title: "Billing",
            url: "#",
            icon: CreditCard,
          },
          {
            title: "Invoices",
            url: "#",
            icon: Receipt,
          },
          {
            title: "Subscriptions",
            url: "#",
            icon: Calendar,
          },
          {
            title: "Tax Reports",
            url: "#",
            icon: FileText,
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings,
        items: [
          {
            title: "General",
            url: "#",
            icon: Settings,
          },
          {
            title: "Security",
            url: "#",
            icon: Shield,
          },
          {
            title: "Notifications",
            url: "#",
            icon: BellIcon,
          },
          {
            title: "Integrations",
            url: "#",
            icon: Plug,
          },
          {
            title: "API Settings",
            url: "#",
            icon: Code,
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

  const SheetMenuItems = () => (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b">
        <Avatar className="h-12 w-12 rounded-lg">
          {userData.avatar && (
            <AvatarImage
              src={userData.avatar || "/placeholder.svg"}
              alt={userData.name}
            />
          )}
          <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
            {getInitials(userData.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-lg">{userData.name}</span>
          <span className="text-sm text-muted-foreground">
            {userData.email}
          </span>
        </div>
      </div>
      <div className="p-2 space-y-1">
        <button className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
          <Crown className="mr-3 h-4 w-4" />
          {t("Upgrade to Pro")}
        </button>
        <Separator className="my-2" />
        <button className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
          <UserIcon className="mr-3 h-4 w-4" />
          {t("Account")}
        </button>
        <button className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
          <CreditCard className="mr-3 h-4 w-4" />
          {t("Billing")}
        </button>
        <button className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
          <BellIcon className="mr-3 h-4 w-4" />
          {t("Notifications")}
        </button>
        <PreferencesMenu />
        <Separator className="my-2" />
        <button className="flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 cursor-pointer">
          <LogOut className="mr-3 h-4 w-4" />
          {t("Log out")}
        </button>
      </div>
    </div>
  );

  const DropdownMenuItems = () => (
    <>
      <div className="flex items-center gap-3 p-4 border-b">
        <Avatar className="h-12 w-12 rounded-lg">
          {userData.avatar && (
            <AvatarImage
              src={userData.avatar || "/placeholder.svg"}
              alt={userData.name}
            />
          )}
          <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
            {getInitials(userData.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-lg">{userData.name}</span>
          <span className="text-sm text-muted-foreground">
            {userData.email}
          </span>
        </div>
      </div>
      <div className="p-2 space-y-1">
        <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer">
          <Crown className="mr-3 h-4 w-4" />
          {t("Upgrade to Pro")}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer">
          <UserIcon className="mr-3 h-4 w-4" />
          {t("Account")}
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer">
          <CreditCard className="mr-3 h-4 w-4" />
          {t("Billing")}
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer">
          <BellIcon className="mr-3 h-4 w-4" />
          {t("Notifications")}
        </DropdownMenuItem>
        <PreferencesMenu />
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer">
          <LogOut className="mr-3 h-4 w-4" />
          {t("Log out")}
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
                <span className="font-semibold">{t("AMATA")}</span>
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
                        <SidebarMenuButton asChild isActive={subItem.isActive}>
                          <a
                            href={subItem.url}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <subItem.icon className="size-4" />
                            <span>{t(subItem.title)}</span>
                          </a>
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
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      {userData.avatar && (
                        <AvatarImage
                          src={userData.avatar || "/placeholder.svg"}
                          alt={userData.name}
                        />
                      )}
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                        {getInitials(userData.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData.name}
                      </span>
                      <span className="truncate text-xs">{userData.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-auto max-h-[70vh] p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>User Menu</SheetTitle>
                    <SheetDescription>
                      Access your account settings, billing information, and
                      other user options.
                    </SheetDescription>
                  </SheetHeader>
                  <SheetMenuItems />
                </SheetContent>
              </Sheet>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      {userData.avatar && (
                        <AvatarImage
                          src={userData.avatar || "/placeholder.svg"}
                          alt={userData.name}
                        />
                      )}
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                        {getInitials(userData.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData.name}
                      </span>
                      <span className="truncate text-xs">{userData.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 min-w-56 rounded-lg p-0"
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
