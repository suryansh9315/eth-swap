import { useMainContext } from "../context";
import React, { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import SingleTokenListModal from "./SingleTokenListModal";

const TokenListModal = ({
  setOpenTokenListOne,
  allTokens,
  setToken,
  currentToken,
  nativeToken,
  currentTokenTwo,
}) => {
  const { blurScreen, setBlurScreen } = useMainContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [favouriteTokens, setFavouriteTokens] = useState(allTokens);
  const [tokenList, setTokenList] = useState(allTokens);

  // useEffect(() => {
  //   if (nativeToken !== null) {
  //     setTokenList([nativeToken, ...allTokens])
  //     setFavouriteTokens([nativeToken, ...allTokens])
  //   }
  // }, [nativeToken])

  return (
    <div className="bg-[#1E293B] w-[500px] rounded-xl shadow-md px-6 py-6 z-10 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white text-lg">Select a token</div>
          <div className="text-gray-400 text-sm">
            Select a token from our default list or search for a token by symbol
            or address.
          </div>
        </div>
        <div
          onClick={() => {
            setBlurScreen(false);
            setOpenTokenListOne(false);
          }}
          className="bg-[#2b3647] hover:bg-[#3e4d6b] transition-all duration-300 px-3 py-3 rounded-full"
        >
          <MdOutlineClose color="#fff" size={20} />
        </div>
      </div>
      <div className="flex items-center gap-3 bg-[#2b3647] px-3 py-2 rounded-xl">
        <IoSearchOutline size={24} color="#6B7280" className="cursor-pointer" />
        <input
          placeholder="Search by token or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#2b3647] w-full outline-none placeholder:text-[#6B7280]"
        />
      </div>
      {favouriteTokens.length !== 0 && (
        <div className="flex flex-wrap gap-2">
          {favouriteTokens.map((token, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-2 px-2 py-2 rounded-lg bg-[#2b3647] text-sm cursor-pointer"
              onClick={() => {
                if (token !== currentTokenTwo) {
                  setToken(token);
                  setOpenTokenListOne(false);
                  setBlurScreen(false);
                }
              }}
            >
              <img src={token.tokenImage === undefined ? '/tokens/EmptyToken.webp' : token.tokenImage} alt="" className="h-4 w-4" />
              {token.tokenSymbol}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-1 px-1 py-1 bg-[#273143] rounded-xl h-[400px] no-scrollbar overflow-y-scroll">
        {tokenList.map((token, i) => (
          <SingleTokenListModal
            key={i}
            token={token}
            setToken={setToken}
            currentToken={currentToken}
            favouriteTokens={favouriteTokens}
            setFavouriteTokens={setFavouriteTokens}
            setOpenTokenListOne={setOpenTokenListOne}
            setBlurScreen={setBlurScreen}
            currentTokenTwo={currentTokenTwo}
          />
        ))}
      </div>
    </div>
  );
};

export default TokenListModal;
