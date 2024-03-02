import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { MainContextProvider } from "./context";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SwapSection from "./components/SwapSection.jsx";

const projectId = "dee181540782f58a9f57ef39714f7ed0";
const mainnet = [
  {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
  },
  {
    chainId: 5,
    name: "Goerli test network",
    currency: "GoerliETH",
    explorerUrl: "https://goerli.etherscan.io",
    rpcUrl: "https://eth-goerli.g.alchemy.com/v2/EJhmUxJMBT0k2PJRR-h-RY9PvD2dwSOc",
  },
];

const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <SwapSection />,
      },
    ],
  },
]);

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: mainnet,
  projectId,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <MainContextProvider>
    <RouterProvider router={router} />
  </MainContextProvider>
);
