"use client";

import React, { ReactNode } from "react";
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { metaMask, hooks, metaMaskStore } from "../../connections/metaMask";
import { Connector, Web3ReactStore } from "@web3-react/types";

export function Web3ReactProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  // 使用三元组（包含 store）
  const connectors: [Connector, Web3ReactHooks, Web3ReactStore][] = [
    [metaMask, hooks, metaMaskStore],
  ];

  return (
    <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
  );
}
