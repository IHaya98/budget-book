'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link
} from "@heroui/react";
import { HomeIcon, ChartBarIcon, CogIcon, WalletIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'ホーム', href: '/', icon: HomeIcon },
  { name: '収支管理', href: '/transactions', icon: WalletIcon },
  { name: '予算設定', href: '/budgets', icon: ChartBarIcon },
  { name: 'カテゴリ', href: '/categories', icon: CogIcon },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className="bg-background/60 backdrop-blur-md border-b border-divider">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            <span className="text-primary">家計簿</span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavbarItem key={item.name} isActive={isActive} className={isActive ? "text-blue-500" : "text-white-500"}>
              <Link
                href={item.href}
                className="flex items-center gap-2"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarMenu>
        {navigation.map((item,index) => {
          return (
            <NavbarMenuItem key={item.name}>
              <Link
                href={item.href}
                className="w-full"
                color={
                  index === 2 ? "warning" : index === navigation.length - 1 ? "danger" : "foreground"
                }
                onClick={() => setIsMenuOpen(false)}
                size="lg"
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </Navbar>
  );
}
