"use client";

import Link from "next/link";
import Image from "next/image";
import { MenuItem } from "@/components/header/MenuItem";
import { LocationItem } from "@/components/header/LocationItem";
import { SearchBar } from "@/components/header/SearchBar";
import { PhoneItem } from "@/components/header/PhoneItem";
import { StoreItem } from "@/components/header/StoreItem";
import { DeliveryTrackingItem } from "@/components/header/DeliveryTrackingItem";
import { CartItem } from "@/components/header/CartItem";
import { UserItem } from "@/components/header/UserItem";
import { MenuBanner } from "@/components/layout/MenuBanner";
import {
  MenuIcon,
  LocationIcon,
  PhoneIcon,
  StoreIcon,
  DeliveryTrackingIcon,
  CartIcon,
  UserIcon,
} from "@/components/icons/HeaderIcons";
import { useState, useEffect } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Simple client-side check: try to read stored user or token
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        try {
          const parsed = JSON.parse(rawUser);
          setUserName(parsed?.name ?? String(parsed));
          return;
        } catch (e) {
          setUserName(rawUser);
          return;
        }
      }
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      if (token) {
        // token present — optionally fetch profile here. For now show generic 'Tài khoản'
        setUserName("Tài khoản");
        return;
      }
      setUserName(null);
    } catch (err) {
      setUserName(null);
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#d70018] shadow-md">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-2 h-[64px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
          <Image
            src="/images/logo-dtphone-store.png"
            alt="Logo CellphoneS"
            width={180}
            height={50}
            priority
          />
        </Link>

        <div className="flex items-center gap-x-2 flex-nowrap overflow-x-auto flex-1 justify-end">
          {/* Danh mục */}
          <MenuItem icon={<MenuIcon className="w-6 h-6" />} onClick={() => setIsMenuOpen(prev => !prev)}>
            <span>Danh mục</span>
          </MenuItem>

          {/* Xem giá tại */}
          <LocationItem
            icon={<LocationIcon className="w-6 h-6" />}
            location="Hồ Chí Minh"
          />

          {/* Search */}
          <SearchBar />

          {/* Gọi mua hàng */}
          <PhoneItem
            icon={<PhoneIcon className="w-6 h-6" />}
            number="1800.2097"
          />

          {/* Cửa hàng gần bạn */}
          <StoreItem
            icon={<StoreIcon className="w-6 h-6" />}
            text="Cửa hàng<br />gần bạn"
          />

          {/* Tra cứu đơn hàng */}
          <DeliveryTrackingItem
            icon={<DeliveryTrackingIcon className="w-10 h-10" />}
            text="Tra cứu<br />đơn hàng"
          />

          {/* Giỏ hàng */}
          <CartItem icon={<CartIcon className="w-6 h-6" />} text="Giỏ<br />hàng" />

          {/* Tài khoản */}
          {userName ? (
            <Link href="/information">
              <UserItem icon={<UserIcon className="w-6 h-6" />} name={userName} />
            </Link>
          ) : (
            <Link href="/login">
              <button className="bg-white text-[#d70018] rounded-xl px-3 py-1 text-[13px] font-medium">
                Đăng nhập
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Menu Banner as Overlay */}
      {isMenuOpen && (
        <MenuBanner
          isOverlay
          onClose={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;