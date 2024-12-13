"use client";

import { useEffect, useState } from "react";
import { MetaMaskSDK } from "@metamask/sdk";

export default function ConnectButton() {
  const [sdk, setSDK] = useState<MetaMaskSDK | null>(null);

  useEffect(() => {
    const MMSDK = new MetaMaskSDK({
      dappMetadata: {
        name: "Web3 University",
        url: window.location.href,
      },
    });
    setSDK(MMSDK);
  }, []);

  return (
    <div>
      <button
        onClick={() => sdk?.connect()}
        className="relative top-32 left-32 bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
      >
        Connect MetaMask
      </button>
    </div>
  );
}
