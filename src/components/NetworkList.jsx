import React, { useEffect, useState } from "react";
import {
  Eth,
  Arbritrium,
  Optimism,
  Polygon,
  Base,
  Bnb,
  Avalanche,
} from "../assets";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";

const allNetworks = [
  {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
    image: Eth,
  },
  {
    chainId: 5,
    name: "Goerli test network",
    currency: "GoerliETH",
    explorerUrl: "https://goerli.etherscan.io",
    rpcUrl:
      "https://eth-goerli.g.alchemy.com/v2/EJhmUxJMBT0k2PJRR-h-RY9PvD2dwSOc",
  },
];

const NetworkList = () => {
  const { open } = useWeb3Modal();
  const { chainId, address } = useWeb3ModalAccount();
  const [currentNetwork, setCurrentNetwork] = useState(allNetworks[0]);

  useEffect(() => {
    if (chainId) {
      if (allNetworks.find((item) => item.chainId === chainId) !== undefined) {
        setCurrentNetwork(allNetworks.find((item) => item.chainId === chainId));
      } else {
        setCurrentNetwork({
          chainId: chainId,
          name: "Chain Not Supported",
          currency: "",
          explorerUrl: "",
          rpcUrl: "",
        });
      }
    } else {
      setCurrentNetwork(allNetworks[0]);
    }
  }, [chainId]);

  return (
    <div className="relative">
      <div
        onClick={() => {
          if (address) {
            open({ view: "Networks" });
          }
        }}
        className="flex items-center justify-center gap-3 cursor-pointer h-12 py-3 px-5 rounded-lg bg-[#182133] text-sm hover:bg-[#232f4b] transition-all duration-300"
      >
        {currentNetwork.image === undefined ? (
          <div className="h-4 w-4 rounded-full flex items-center justify-center">
            {currentNetwork.name.substring(0, 1)}
          </div>
        ) : (
          <img
            src={currentNetwork.image}
            alt=""
            className="h-7 w-7 object-cover"
          />
        )}

        <div className="">{currentNetwork.name}</div>
      </div>
    </div>
  );
};

export default NetworkList;
