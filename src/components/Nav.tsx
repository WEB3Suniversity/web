"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hooks, metaMask } from "@/connections/metaMask";

const { useAccounts, useIsActive } = hooks;

const NavBar = () => {
  const accounts = useAccounts();
  const isActive = useIsActive();
  const [storedAccount, setStoredAccount] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAccount = localStorage.getItem("user_account");
      if (userAccount) {
        setStoredAccount(userAccount);
      }
    }
  }, []);

  const handleLogin = async () => {
    try {
      await metaMask.activate();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  useEffect(() => {
    if (isActive && accounts && accounts.length > 0) {
      const account = accounts[0];
      localStorage.setItem("user_account", account);
      setStoredAccount(account);
      router.push("/user");
    }
  }, [isActive, accounts, router]);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#0f172a] text-white">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-400 rounded"></div>
        <span className="font-semibold text-lg">Ixartz's Blog</span>
      </div>

      <div className="hidden md:flex space-x-8 text-gray-200">
        <a href="#" className="hover:text-white transition-colors">
          课程
        </a>
        <a href="#" className="hover:text-white transition-colors">
          博客
        </a>
        <a href="#" className="hover:text-white transition-colors">
          我的
        </a>
      </div>

      <div className="flex items-center space-x-4">
        {storedAccount ? (
          <div className="flex items-center space-x-2">
            <span className="block w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-gray-200">
              {storedAccount.slice(0, 6)}...{storedAccount.slice(-4)}
            </span>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition-colors"
          >
            登陆
          </button>
        )}

        <button className="md:hidden focus:outline-none">
          <svg
            className="w-6 h-6 text-gray-200 hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
