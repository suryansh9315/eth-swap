import React from "react";
import { Link } from "react-router-dom";
import { SiExpertsexchange } from "react-icons/si";
import NetworkList from "./NetworkList";
import { useMainContext } from "../context";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useDisconnect,
} from "@web3modal/ethers/react";

const MenuItems = [
  {
    name: "Swap",
    path: "/",
  },
  {
    name: "Tokens",
    path: "/",
  },
  {
    name: "Pools",
    path: "/",
  },
  {
    name: "Stake",
    path: "/",
  },
  {
    name: "Buy Crypto",
    path: "/",
  },
  {
    name: "NFTs",
    path: "/",
  },
];

const Navbar = () => {
  const { blurScreen, setBlurScreen } = useMainContext();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();

  return (
    <div
      className={`flex items-center justify-between py-5 px-10 ${
        blurScreen ? "blur-sm" : ""
      }`}
    >
      <div className="flex items-center gap-10">
        <div>
          <SiExpertsexchange color="#3A83F6" size={35} />
        </div>
        <div className="flex items-center gap-1">
          {MenuItems.map((item, i) => (
            <Link key={i} to={item.path}>
              <div className="text-sm hover:bg-[#232f4b] transition-all duration-300 px-3 py-2 rounded-lg">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <NetworkList />
        <div
          onClick={() => {
            if (isConnected) {
              disconnect();
            } else {
              open();
            }
          }}
          className="cursor-pointer px-5 py-3 h-12 rounded-lg bg-[#182133] text-sm hover:bg-[#232f4b] transition-all duration-300"
        >
          {isConnected ? address.substring(0,12) + "..." : 'Connect Wallet'}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
