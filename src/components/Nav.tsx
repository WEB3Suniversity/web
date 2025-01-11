"use client";

import React, { useEffect, useState } from "react";
import { hooks, metaMask } from "@/connections/metaMask";
import MetaMaskCard from "@/components/connectorCards/MetaMaskCard";
import ExchangeModal from "@/components/CourseMarketPage";
import dynamic from "next/dynamic";
import UpLink from "./UpLink";

const Avatar = dynamic(() => import("@/components/Jazzicon"), { ssr: false });

// Hooks
const { useAccounts, useIsActive, useIsActivating } = hooks;

const NavBar = () => {
  const accounts = useAccounts();
  const isActive = useIsActive();
  const isActivating = useIsActivating();
  const [storedAccount, setStoredAccount] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"login" | "logout" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const router = useRouter();
  console.log(isActivating, "isActivating-isActivating");

  // Sync local storage and account
  useEffect(() => {
    const savedAccount = localStorage.getItem("user_account");
    if (savedAccount) {
      setStoredAccount(savedAccount);
    }
  }, []);

  // Save account to local storage
  useEffect(() => {
    if (isActive && accounts && accounts.length > 0) {
      const account = accounts[0];
      localStorage.setItem("user_account", account);
      setStoredAccount(account);
    }
  }, [isActive, accounts]);

  // Handle Login
  const handleLogin = async () => {
    try {
      await metaMask.activate();
      setShowModal(false);
      console.log("Wallet connected successfully!");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    //需不需要真正的进行断开链接
    if (metaMask?.deactivate) {
      void metaMask.deactivate();
    } else {
      //状态清空
      void metaMask.resetState();
      //用户断开链接的时候 清空desiredChainId
      // setDesiredChainId(null);
    }
    setShowModal(false);
    setStoredAccount(null);
  };

  // Show Modal for Login or Logout
  const toggleModal = (type: "login" | "logout") => {
    setModalType(type);
    setShowModal(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-1 py-1  text-white relative z-10 ">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gradient-to-r from-primary-dark to-primary-light rounded"></div>
        <span className="font-semibold text-lg">WEB3 College</span>
      </div>
      <div className="hidden md:flex space-x-8 text-gray-200">
        <UpLink text="Courses" href="/CourseMarket" showArrow={false}></UpLink>
        <UpLink text="Articles" href="/articles" showArrow={false}></UpLink>
        <UpLink text=" My Profile" href="/user" showArrow={false}></UpLink>
        <UpLink text=" Redeem WEBAI" href="/user" showArrow={false}></UpLink>
      </div>

      <div className="flex items-center space-x-4">
        {isActive && storedAccount ? (
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => toggleModal("logout")}
          >
            <Avatar address={storedAccount} />
            <span className="block w-2 h-2 bg-green-500 rounded-full"></span>
            <span>
              {storedAccount?.slice(0, 6)}...{storedAccount.slice(-4)}
            </span>
          </div>
        ) : (
          <button
            onClick={() => toggleModal("login")}
            className="bg-primary-dark hover:bg-primary-light hover:text-black text-white py-1 px-3 rounded transition-colors"
          >
            {isActivating ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            {modalType === "login" ? (
              <>
                <h2 className="text-xl font-semibold mb-4 text-black">
                  Connect Wallet
                </h2>
                <p className=" text-black">
                  Would you like to connect your wallet?
                </p>
                <MetaMaskCard />
                <div className="mt-4 space-x-4">
                  <button
                    onClick={handleLogin}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Connect
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4 text-black">
                  Disconnect Wallet
                </h2>
                <p className="text-black">
                  Are you sure you want to disconnect your wallet?
                </p>
                <div className="mt-4 space-x-4">
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  >
                    Disconnect
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {isModalOpen && <ExchangeModal onClose={closeModal} />}
    </nav>
  );
};

export default NavBar;
