
"use client";

import type { FC, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Archive,
  LogOut,
  Box,
  Building,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSession, clearSession } from '@/lib/session';
import { AuthUser } from '@/types/auth.types';

const DashboardLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser>();
  const Rol = {
    Admin: 'ADM',
    Tecnico: 'TEC',
    Personal: 'PER'
  } as const;

  useEffect(() => {
    const session = getSession();

    if(!session) {
      console.log(session);
      console.log('no esta cargando');
      return;
    }

    setUser(session.user);
  }, []);
  
  function nameInitials(name?: string) {
      if(!name?.trim()) return "NA";

      const names = name.trim().split(" ");

      if(names.length === 1){
        return names[0][0];
      }

        return `${names[0][0]}${names[names.length - 1][0]}`;
  }

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  const CAN_VIEW = {
    Empresas: user?.rol === Rol.Admin,
    Usuarios: user?.rol === Rol.Admin || user?.rol === Rol.Tecnico,
    Dasboard: user?.rol === Rol.Admin || user?.rol === Rol.Tecnico
  } as const;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3 p-2">
              <Box className="size-8 text-primary-foreground" />
              <h1 className="text-xl font-bold font-headline text-primary-foreground">
                Activos Pro
              </h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {CAN_VIEW.Dasboard && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/') || isActive('/dashboard')} tooltip="Inicio">
                    <Link href="/">
                      <LayoutDashboard />
                      <span>Inicio</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {CAN_VIEW.Empresas && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/empresas')} tooltip="Empresas">
                    <Link href="/empresas">
                      <Building />
                      <span>Empresas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {CAN_VIEW.Usuarios && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/users')} tooltip="Usuarios">
                    <Link href="/users">
                      <Users />
                      <span>Usuarios</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/assets')} tooltip="Activos">
                  <Link href="/assets">
                    <Archive />
                    <span>Activos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{nameInitials(user?.name).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user?.name}
                </span>
                <span className="text-xs text-sidebar-foreground/70 truncate">
                  {user?.email}
                </span>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  <span>Cerrar Sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="overflow-auto">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
