import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSettingsOutline } from "react-icons/io5";
import { TbArrowsCross } from "react-icons/tb";
import { IoWallet } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { LuArrowDownUp } from "react-icons/lu";
import SwapSettingsModal from "./SwapSettingsModal";
import { useMainContext } from "../context";
import TokenListModal from "./TokenListModal";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import {
  BrowserProvider,
  Contract,
  formatUnits,
  parseUnits,
  AbiCoder,
  JsonRpcProvider,
} from "ethers";
import IUniswapV3PoolArtifact from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json";
import {
  ERC20ABI,
  GoerliERC20ABI,
  SingleSwapTokenABI,
  SingleSwapTokenAddress,
  POOL_FACTORY_CONTRACT_ADDRESS,
  QUOTER_CONTRACT_ADDRESS,
  POOL_FACTORY_CONTRACT_ABI,
  SWAP_ROUTER_ADDRESS
} from "../constants";
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import {
  FeeAmount,
  Pool,
  Route,
  SwapQuoter,
  SwapRouter,
  Trade,
  computePoolAddress,
} from "@uniswap/v3-sdk";
import { AlphaRouter, SwapType } from "@uniswap/smart-order-router";
import JSBI from "jsbi";

const allNetworks = [
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
    rpcUrl:
      "https://eth-goerli.g.alchemy.com/v2/EJhmUxJMBT0k2PJRR-h-RY9PvD2dwSOc",
  },
];
const ethTokens = [
  {
    tokenName: "Ether",
    tokenImage: "/tokens/eth/ETH.webp",
    tokenSymbol: "ETH",
    tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    tokenDecimals: 18,
    isNative: true,
  },
  {
    tokenName: "Tether USD",
    tokenImage: "/tokens/eth/USDT.webp",
    tokenSymbol: "USDT",
    tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    tokenDecimals: 6,
    isNative: false,
  },
  {
    tokenName: "BNB",
    tokenImage: "/tokens/eth/BNB.webp",
    tokenSymbol: "BNB",
    tokenAddress: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    tokenDecimals: 18,
    isNative: false,
  },
  {
    tokenName: "USDC",
    tokenImage: "/tokens/eth/USDC.webp",
    tokenSymbol: "USDC",
    tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    tokenDecimals: 6,
    isNative: false,
  },
  {
    tokenName: "SHIBA INU",
    tokenImage: "/tokens/eth/SHIB.webp",
    tokenSymbol: "SHIB",
    tokenAddress: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    tokenDecimals: 18,
    isNative: false,
  },
  {
    tokenName: "Dai Stablecoin",
    tokenImage: "/tokens/eth/DAI.webp",
    tokenSymbol: "DAI",
    tokenAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    tokenDecimals: 18,
    isNative: false,
  },
];
const goerliTokens = [
  {
    tokenName: "Goerli Ether",
    tokenSymbol: "GoerliETH",
    tokenAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    tokenDecimals: 18,
    isNative: true,
  },
  {
    tokenName: "USD Coin",
    tokenSymbol: "USDC",
    tokenAddress: "0xa3e0Dfbf8DbD86e039f7CDB37682A776D66dae4b",
    tokenDecimals: 6,
    isNative: false,
  },
];

const SwapSection = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { blurScreen, setBlurScreen } = useMainContext();
  const [openSettings, setOpenSettings] = useState(false);
  const [crossChainSwap, setCrossChainSwap] = useState(false);
  const [openTokenListOne, setOpenTokenListOne] = useState(false);
  const [openTokenListTwo, setOpenTokenListTwo] = useState(false);
  const [openChainListOne, setOpenChainListOne] = useState(false);
  const [openChainListTwo, setOpenChainListTwo] = useState(false);
  const [nativeToken, setNativeToken] = useState({
    tokenName: "Ether",
    tokenImage: "/tokens/eth/ETH.png",
    tokenSymbol: "ETH",
  });
  const [nativeTokenAmountWallet, setNativeTokenAmountWallet] =
    useState("0.00");
  const [currentTokensList, setCurrentTokensList] = useState(ethTokens);
  const [tokenOne, setTokenOne] = useState(currentTokensList[0]);
  const [tokenTwo, setTokenTwo] = useState(null);
  const [chainOne, setChainOne] = useState(allNetworks[0]);
  const [chainTwo, setChainTwo] = useState(null);
  const [tokenOneAmount, setTokenOneAmount] = useState("");
  const [tokenOneAmountWallet, setTokenOneAmountWallet] = useState("0.00");
  const [tokenOneAmountDollar, setTokenOneAmountDollar] = useState("0.00");
  const [tokenTwoAmount, setTokenTwoAmount] = useState("");
  const [tokenTwoAmountWallet, setTokenTwoAmountWallet] = useState("0.00");
  const [tokenTwoAmountDollar, setTokenTwoAmountDollar] = useState("0.00");
  const [gasFees, setGasFees] = useState(0);
  const [gasFeesSection, setGasFeesSection] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorString, setErrorString] = useState("");

  const performSwap = async () => {
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contractOne = new Contract(tokenOne.tokenAddress, ERC20ABI, signer);
      const balanceOne = await contractOne.balanceOf(address);
      const balanceOneString = formatUnits(balanceOne, tokenOne.tokenDecimals);
      const contractTwo = new Contract(tokenTwo.tokenAddress, ERC20ABI, signer);
      // if (+tokenOneAmount > +balanceOneString) {
      //   setErrorString("Insufficient balance");
      //   setErrorStatus(true);
      //   return;
      // }
      const tokenA = new Token(
        chainId,
        tokenOne.tokenAddress,
        tokenOne.tokenDecimals
      );
      const tokenB = new Token(
        chainId,
        tokenTwo.tokenAddress,
        tokenTwo.tokenDecimals
      );
      const factoryContract = new Contract(
        POOL_FACTORY_CONTRACT_ADDRESS,
        POOL_FACTORY_CONTRACT_ABI,
        ethersProvider
      );
      const poolAddress = await factoryContract.getPool(
        tokenA.address,
        tokenB.address,
        3000
      );
      if (poolAddress === "0x0000000000000000000000000000000000000000") {
        setErrorString("Swap not supported");
        setErrorStatus(true);
        return;
      }
      const poolContract = new Contract(
        poolAddress,
        IUniswapV3PoolArtifact.abi,
        ethersProvider
      );
      const [token0, token1, fee, liquidity, slot0] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.liquidity(),
        poolContract.slot0(),
      ]);
      if (Number(slot0[2]) === 0) {
        setErrorString("Pool is empty");
        setErrorStatus(true);
        return;
      }
      const pool = new Pool(
        tokenA,
        tokenB,
        FeeAmount.MEDIUM,
        Number(slot0[0]),
        Number(liquidity),
        Number(slot0[1])
      );
      const swapRoute = new Route([pool], tokenA, tokenB);
      const amountOut = await getQuote();
      const uncheckedTrade = Trade.createUncheckedTrade({
        route: swapRoute,
        inputAmount: CurrencyAmount.fromRawAmount(
          tokenA,
          parseUnits(tokenOneAmount, tokenA.decimals).toString()
        ),
        outputAmount: CurrencyAmount.fromRawAmount(
          tokenB,
          parseUnits(amountOut, tokenB.decimals).toString()
        ),
        tradeType: TradeType.EXACT_INPUT,
      });
      const transaction = await contractOne.approve(
        SWAP_ROUTER_ADDRESS,
        parseUnits(tokenOneAmount, tokenA.decimals).toString()
      );
      const transaction_data = {
        ...transaction,
        from: address,
      };
      const receipt = await ethersProvider?.send("eth_sendTransaction", [
        transaction_data,
      ]);
      if (!receipt) {
        setErrorString("Swap failed");
        setErrorStatus(true);
        return;
      }
      const options = {
        slippageTolerance: new Percent(50, 10_000),
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        recipient: address,
      };
      const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } =
        await ethersProvider.getFeeData();
      const methodParameters = SwapRouter.swapCallParameters(
        [uncheckedTrade],
        options
      );
      const tx = {
        data: methodParameters.calldata,
        to: SWAP_ROUTER_ADDRESS,
        value: methodParameters.value,
        from: address,
        maxFeePerGas: '10000000',
        maxPriorityFeePerGas: '10000000',
      };
      const receipt_2 = await ethersProvider?.send("eth_sendTransaction", [tx]);
      if (!receipt_2) {
        setErrorString("Swap failed");
        setErrorStatus(true);
        return;
      }
      const balanceTwo = await contractTwo.balanceOf(address);
      const balanceTwoString = formatUnits(balanceTwo, tokenTwo.tokenDecimals);
      console.log(balanceTwoString);
      alert("Swap Successfull");
      setErrorStatus(false);
    } catch (error) {
      console.log(error);
      setErrorString("Swap failed");
      setErrorStatus(true);
    } finally {
      setTokenOneAmount("");
      setTokenTwoAmount("");
    }
  };

  const updateTokenTwoBalance = async () => {
    if (tokenOneAmount === "") {
      setTokenTwoAmount("");
    }
    if (
      isConnected &&
      tokenOne &&
      tokenTwo &&
      chainId === 1 &&
      +tokenOneAmount > 0
    ) {
      const quote = await getQuote(parseFloat(tokenOneAmount));
      setTokenTwoAmount(quote + "");
    }
  };

  const getQuote = async () => {
    const tokenA = new Token(
      chainId,
      tokenOne.tokenAddress,
      tokenOne.tokenDecimals
    );
    const tokenB = new Token(
      chainId,
      tokenTwo.tokenAddress,
      tokenTwo.tokenDecimals
    );
    const ethersProvider = new BrowserProvider(walletProvider);
    const factoryContract = new Contract(
      POOL_FACTORY_CONTRACT_ADDRESS,
      POOL_FACTORY_CONTRACT_ABI,
      ethersProvider
    );
    const poolAddress = await factoryContract.getPool(
      tokenA.address,
      tokenB.address,
      3000
    );
    if (poolAddress === "0x0000000000000000000000000000000000000000") {
      setErrorString("Swap not supported");
      setErrorStatus(true);
      return "";
    }
    const poolContract = new Contract(
      poolAddress,
      IUniswapV3PoolArtifact.abi,
      ethersProvider
    );
    const [token0, token1, fee, liquidity, slot0] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);
    if (Number(slot0[2]) === 0) {
      setErrorString("Pool is empty");
      setErrorStatus(true);
      return "";
    }
    const pool = new Pool(
      tokenA,
      tokenB,
      FeeAmount.MEDIUM,
      Number(slot0[0]),
      Number(liquidity),
      Number(slot0[1])
    );
    const swapRoute = new Route([pool], tokenA, tokenB);
    const { calldata } = SwapQuoter.quoteCallParameters(
      swapRoute,
      CurrencyAmount.fromRawAmount(
        tokenA,
        parseUnits(tokenOneAmount, tokenOne.tokenDecimals).toString()
      ),
      TradeType.EXACT_INPUT,
      {
        useQuoterV2: true,
      }
    );
    const quoteCallReturnData = await ethersProvider.call({
      to: QUOTER_CONTRACT_ADDRESS,
      data: calldata,
    });
    const temp = AbiCoder.defaultAbiCoder().decode(
      ["uint256"],
      quoteCallReturnData
    );
    const outputAmount = formatUnits(temp[0], tokenTwo.tokenDecimals);
    // const router = new AlphaRouter({
    //   chainId,
    //   ethersProvider,
    // });
    // const route = await router.route(
    //   CurrencyAmount.fromRawAmount(
    //     tokenA,
    //     fromReadableAmount(+tokenOneAmount, tokenA.decimals)
    //   ),
    //   tokenB,
    //   TradeType.EXACT_INPUT,
    //   {
    //     recipient: address,
    //     slippageTolerance: new Percent(50, 10_000),
    //     deadline: Math.floor(Date.now() / 1000 + 1800),
    //     type: SwapType.SWAP_ROUTER_02,
    //   }
    // );
    // const quoteAmountOut = route.quote.toFixed(6);
    setErrorStatus(false);
    return outputAmount;
  };

  const fromReadableAmount = (amount, decimals) => {
    const extraDigits = Math.pow(10, countDecimals(amount));
    const adjustedAmount = amount * extraDigits;
    return JSBI.divide(
      JSBI.multiply(
        JSBI.BigInt(adjustedAmount),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
      ),
      JSBI.BigInt(extraDigits)
    );
  };

  const countDecimals = (x) => {
    if (Math.floor(x) === x) {
      return 0;
    }
    return x.toString().split(".")[1].length || 0;
  };

  const getNativeBalance = async () => {
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const balance = await ethersProvider.getBalance(address);
      const balance_string = formatUnits(balance, 18);
      setNativeTokenAmountWallet(balance_string);
      console.log(balance_string);
      return balance_string;
    } catch (error) {
      console.log(error);
      return "0.0";
    }
  };

  const getCustomTokenBalance = async (tokenAddress, setBalance) => {
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(tokenAddress, GoerliERC20ABI, signer);
      const balance = await contract.balanceOf(address);
      const balance_string = formatUnits(balance, 18);
      setBalance(balance_string);
      console.log(balance_string);
      return balance_string;
    } catch (error) {
      console.log(error);
      return "0.0";
    }
  };

  useEffect(() => {
    if (isConnected) {
      if (chainId === 1) {
        setCurrentTokensList(ethTokens);
        setTokenOne(ethTokens[0]);
        getNativeBalance();
        getCustomTokenBalance(tokenOne.tokenAddress, setTokenOneAmountWallet);
      } else if (chainId === 5) {
        setCurrentTokensList(goerliTokens);
        setTokenOne(goerliTokens[0]);
        getNativeBalance();
        getCustomTokenBalance(tokenOne.tokenAddress, setTokenOneAmountWallet);
      } else {
        setErrorString("Chain not supported");
        setErrorStatus(true);
      }
      setTokenTwo(null);
      setErrorStatus(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      if (chainId === 1) {
        setCurrentTokensList(ethTokens);
        setTokenOne(ethTokens[0]);
        getNativeBalance();
        getCustomTokenBalance(tokenOne.tokenAddress, setTokenOneAmountWallet);
      } else if (chainId === 5) {
        setCurrentTokensList(goerliTokens);
        setTokenOne(goerliTokens[0]);
        getNativeBalance();
        getCustomTokenBalance(tokenOne.tokenAddress, setTokenOneAmountWallet);
      } else {
        setErrorString("Chain not supported");
        setErrorStatus(true);
      }
      setTokenTwo(null);
      setErrorStatus(false);
    }
  }, [chainId]);

  useEffect(() => {
    if (isConnected) {
      getNativeBalance();
      getCustomTokenBalance(tokenOne.tokenAddress, setTokenOneAmountWallet);
      setErrorStatus(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected) {
      if (chainId === 5 || chainId === 1) {
        setTokenOneAmount("");
        setTokenTwoAmount("");
        setErrorStatus(false);
        getCustomTokenBalance(tokenOne.tokenAddress, setTokenOneAmountWallet);
      }
    }
  }, [tokenOne]);

  useEffect(() => {
    if (isConnected && tokenTwo) {
      if (chainId === 5 || chainId === 1) {
        setTokenTwoAmount("");
        setTokenTwoAmountWallet("0.00");
        setErrorStatus(false);
        getCustomTokenBalance(tokenTwo.tokenAddress, setTokenTwoAmountWallet);
      }
    }
  }, [tokenTwo]);

  useEffect(() => {
    updateTokenTwoBalance();
  }, [tokenOneAmount, tokenTwo]);

  return (
    <div className="flex justify-center h-full mt-20">
      <div
        className={`w-[500px] flex flex-col gap-3 ${
          blurScreen ? "blur-sm" : ""
        }`}
      >
        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-2">
            <div
              className={`${
                crossChainSwap ? "bg-[#0E172B]" : "bg-[#232f4b]"
              } hover:bg-[#232f4b] transition-all duration-300 px-3 py-2 rounded-lg cursor-pointer text-sm`}
              onClick={() => setCrossChainSwap(false)}
            >
              Swap
            </div>
            <div
              className={`${
                !crossChainSwap ? "bg-[#0E172B]" : "bg-[#232f4b]"
              } hover:bg-[#232f4b] transition-all duration-300 px-3 py-2 rounded-lg cursor-pointer text-sm flex items-center gap-2 text-[#3A83F6]`}
              // onClick={() => setCrossChainSwap(true)}
            >
              <TbArrowsCross size={16} />
              Cross Chain
            </div>
          </div>
          <div
            onClick={() => {
              setBlurScreen(true);
              setOpenSettings(true);
            }}
            className="px-3 py-3 bg-[#182133] hover:bg-[#232f4b] rounded-full cursor-pointer"
          >
            <IoSettingsOutline />
          </div>
        </div>
        <div className="flex flex-col gap-1 relative">
          <div className="bg-[#232f4b] px-4 py-5 rounded-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <input
                value={tokenOneAmount}
                placeholder="0.00"
                onChange={(e) => {
                  setTokenOneAmount(e.target.value);
                }}
                className="text-white placeholder:text-[#6B7280] bg-[#232f4b] outline-none text-4xl w-[60%]"
                type="number"
              />
              <div
                onClick={() => {
                  setBlurScreen(true);
                  setOpenTokenListOne(true);
                }}
                className="bg-[#0E172B] hover:bg-[#182133] transition-all duration-300 px-4 py-3 flex items-center gap-2 rounded-full cursor-pointer"
              >
                <img
                  src={
                    tokenOne.tokenImage === undefined
                      ? "/tokens/EmptyToken.webp"
                      : tokenOne.tokenImage
                  }
                  alt=""
                  className="h-7 w-7"
                />
                <div className="text-white text-xl">{tokenOne.tokenSymbol}</div>
                <FaAngleDown />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[#a5b0c4]">$ {tokenOneAmountDollar}</div>
              <div className="flex items-center gap-1 text-[#a5b0c4]">
                <IoWallet color="#a5b0c4" />
                {tokenOneAmountWallet}
              </div>
            </div>
          </div>
          <div className="w-8 h-8 cursor-pointer rounded-full bg-[#0E172B] shadow-2xl flex items-center justify-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <LuArrowDownUp color="#3A83F6" size={12} />
          </div>
          <div className="bg-[#232f4b] px-4 py-5 rounded-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <input
                value={tokenTwoAmount}
                placeholder="0.00"
                onChange={(e) => setTokenTwoAmount(e.target.value)}
                className="text-white placeholder:text-[#6B7280] bg-[#232f4b] outline-none text-4xl w-[60%]"
                type="number"
                readOnly={true}
              />
              {tokenTwo ? (
                <div
                  onClick={() => {
                    setBlurScreen(true);
                    setOpenTokenListTwo(true);
                  }}
                  className="bg-[#0E172B] hover:bg-[#182133] transition-all duration-300 px-4 py-3 flex items-center gap-2 rounded-full cursor-pointer"
                >
                  <img
                    src={
                      tokenTwo.tokenImage === undefined
                        ? "/tokens/EmptyToken.webp"
                        : tokenTwo.tokenImage
                    }
                    alt=""
                    className="h-7 w-7"
                  />
                  <div className="text-white text-xl">
                    {tokenTwo.tokenSymbol}
                  </div>
                  <FaAngleDown />
                </div>
              ) : (
                <div
                  onClick={() => {
                    setBlurScreen(true);
                    setOpenTokenListTwo(true);
                  }}
                  className="bg-[#0E172B] hover:bg-[#182133] transition-all duration-300 px-5 py-3 flex items-center gap-2 rounded-full cursor-pointer"
                >
                  <div className="text-[#white] text-lg">Select token</div>
                  <FaAngleDown />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[#a5b0c4]">$ {tokenTwoAmountDollar}</div>
              <div className="flex items-center gap-1 text-[#a5b0c4]">
                <IoWallet color="#a5b0c4" />
                {tokenTwoAmountWallet}
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            if (isConnected) {
              if (chainId === 5 || chainId === 1) {
                if (!tokenTwo) {
                  setErrorString("Select another token to swap");
                  setErrorStatus(true);
                  return;
                }
                if (+tokenOneAmount < 0.001) {
                  setErrorString("Minimum swap of 0.001");
                  setErrorStatus(true);
                  return;
                }
                performSwap();
              } else {
                setErrorString("Chain not supported yet");
                setErrorStatus(true);
                return;
              }
            } else {
              open();
            }
          }}
          className={`my-2 text-center text-[#fff] ${
            !errorStatus
              ? "bg-[#3A83F6] hover:bg-[#235DE2]"
              : "bg-[#ff3939] hover:bg-[#b53232]"
          } transition-all duration-300 py-3 rounded-xl border border-gray-700 cursor-pointer`}
        >
          {!errorStatus
            ? isConnected
              ? "Swap"
              : "Connect Wallet"
            : errorString}
        </div>
        {gasFeesSection && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">Price impact</div>
              <div className="text-blue-100 text-sm">-0.39%</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">Est. received</div>
              <div className="text-blue-100 text-sm">2311.25 SUSHI</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">Min. received</div>
              <div className="text-blue-100 text-sm">2299.7 SUSHI</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">Network fee</div>
              <div className="text-blue-100 text-sm">0.005731 ETH</div>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {openSettings && (
          <motion.div
            key="settingsModal"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{
              opacity: 0,
              scaleY: 0,
              transition: { duration: 0.3 },
            }}
            className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center"
          >
            <SwapSettingsModal setOpenSettings={setOpenSettings} />
          </motion.div>
        )}
        {openTokenListOne && (
          <motion.div
            key="tokenListOneModal"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{
              opacity: 0,
              scaleY: 0,
              transition: { duration: 0.3 },
            }}
            className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center"
          >
            <TokenListModal
              setOpenTokenListOne={setOpenTokenListOne}
              allTokens={currentTokensList}
              setToken={setTokenOne}
              currentToken={tokenOne}
              currentTokenTwo={tokenTwo}
              nativeToken={nativeToken}
            />
          </motion.div>
        )}
        {openTokenListTwo && (
          <motion.div
            key="tokenListTwoModal"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{
              opacity: 0,
              scaleY: 0,
              transition: { duration: 0.3 },
            }}
            className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center"
          >
            <TokenListModal
              setOpenTokenListOne={setOpenTokenListTwo}
              allTokens={currentTokensList}
              setToken={setTokenTwo}
              currentToken={tokenTwo}
              currentTokenTwo={tokenOne}
              nativeToken={nativeToken}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwapSection;
