"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Shield,
  FileClock,
  Settings,
  CircleHelp,
  Users,
  ClipboardList,
  Bot,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Tableau de bord" },
  { href: "/dashboard/analyst", icon: Bot, label: "Analyste IA" },
  { href: "/dashboard/security", icon: Shield, label: "Sécurité" },
  { href: "/dashboard/parental-controls", icon: Users, label: "Contrôles Parentaux" },
  { href: "/dashboard/reports", icon: ClipboardList, label: "Rapports" },
  { href: "/dashboard/logs", icon: FileClock, label: "Journaux" },
  { href: "/dashboard/settings", icon: Settings, label: "Paramètres" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={handleLinkClick}>
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold tracking-tight">
            Guardian
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
                onClick={handleLinkClick}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{ children: "Aide" }} onClick={handleLinkClick}>
                <Link href="#">
                  <CircleHelp />
                  <span>Aide et Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
