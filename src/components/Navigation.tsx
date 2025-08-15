'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenu, 
  NavbarMenuItem, 
  NavbarMenuToggle,
} from "@heroui/react";
import { HomeIcon, ChartBarIcon, CogIcon, WalletIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'ホーム', href: '/', icon: HomeIcon },
  { name: '収支管理', href: '/transactions', icon: WalletIcon },
  { name: '予算設定', href: '/budgets', icon: ChartBarIcon },
  { name: 'カテゴリ', href: '/categories', icon: CogIcon },
];

export default function Navigation() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-background/60 backdrop-blur-md border-b border-divider">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label="メニューを開く"
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
            <NavbarItem key={item.name} isActive={isActive}>
              <Link
                href={item.href}
                className="flex items-center gap-2"
                color={isActive ? "primary" : "foreground"}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarMenu>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavbarMenuItem key={item.name}>
              <Link
                href={item.href}
                className={`w-full flex items-center gap-2 p-2 rounded-lg ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
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
