"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldAlert,
  User,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { mockUser } from "@/lib/data";

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith("/dashboard/analyst")) return "Analyste IA";
  if (pathname.startsWith("/dashboard/security")) return "Sécurité";
  if (pathname.startsWith("/dashboard/logs")) return "Journaux et Historique";
  if (pathname.startsWith("/dashboard/parental-controls")) return "Contrôles Parentaux";
  if (pathname.startsWith("/dashboard/reports")) return "Rapports";
  if (pathname.startsWith("/dashboard/settings")) return "Paramètres";
  return "Tableau de bord";
};

const notifications = [
    {
        icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
        title: "Menace critique détectée",
        description: "Appareil inconnu bloqué sur le port 3389.",
        time: "2m"
    },
    {
        icon: <User className="h-4 w-4 text-blue-500" />,
        title: "Nouvel appareil connecté",
        description: "Un nouveau smartphone s'est connecté au réseau invité.",
        time: "1h"
    }
]

export function Header() {
  const { toggleSidebar, state } = useSidebar();
  const pathname = usePathname();
  const userAvatar = getPlaceholderImage("user-avatar");

  return (
    <header className="fixed left-0 right-0 top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
       <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
           {state === 'expanded' ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
        <h1 className="font-headline text-xl font-semibold md:text-2xl">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {notifications.map((item, index) => (
                        <DropdownMenuItem key={index} className="gap-3">
                            {item.icon}
                            <div className="flex-1">
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{item.time}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-sm text-muted-foreground">
                    Voir toutes les notifications
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                {userAvatar && (
                   <AvatarImage
                    src={userAvatar.imageUrl}
                    alt={mockUser.name}
                    data-ai-hint={userAvatar.imageHint}
                  />
                )}
                <AvatarFallback>
                  {mockUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{mockUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {mockUser.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">Se déconnecter</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
