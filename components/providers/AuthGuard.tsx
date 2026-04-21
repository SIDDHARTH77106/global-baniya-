'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  
  const router = useRouter();
  const pathname = usePathname();
  
  // 🔴 MAGIC FIX: Yeh check karega ki LocalStorage theek se read hui ya nahi
  const [isStoreReady, setIsStoreReady] = useState(false);

  useEffect(() => {
    // Zustand ki memory (LocalStorage) read hone ka wait karo
    const checkStore = () => {
      if (useAuthStore.persist.hasHydrated()) {
        setIsStoreReady(true); // Memory read ho gayi!
      } else {
        setTimeout(checkStore, 50); // Agar nahi hui, toh 50 milliseconds baad wapas check karo
      }
    };
    
    checkStore();
  }, []);

  useEffect(() => {
    // Jab tak memory poori tarah read na ho jaye, Bouncer ko aaram karne do
    if (!isStoreReady) return;

    const publicPaths = ['/login', '/register', '/forgot-password'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!isAuthenticated && !isPublicPath) {
      // Memory check hui aur sach mein Login nahi hai
      router.replace('/login');
    } else if (isAuthenticated && isPublicPath) {
      // Memory check hui, Login hai, aur galti se Login page par wapas aaya hai
      if (user?.role === 'retailer') {
        router.replace('/retailer/dashboard');
      } else if (user?.role === 'wholesaler') {
        router.replace('/wholesaler/dashboard');
      } else {
        router.replace('/');
      }
    }
  }, [isStoreReady, isAuthenticated, pathname, router, user]);

  // 🔴 Jab tak memory check ho rahi hai, screen ko flash hone se roko
  if (!isStoreReady) return null;

  const publicPaths = ['/login', '/register', '/forgot-password'];
  const isPublicPath = publicPaths.includes(pathname);
  
  // Agar login nahi hai aur restricted page par hai, toh UI bilkul render mat karo
  if (!isAuthenticated && !isPublicPath) return null;

  // Sab theek hai toh user ko website dikhao
  return <>{children}</>;
}