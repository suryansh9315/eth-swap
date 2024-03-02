import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";

const SingleTokenListModal = ({
  token,
  currentToken,
  setToken,
  favouriteTokens,
  setFavouriteTokens,
  setOpenTokenListOne,
  setBlurScreen,
  currentTokenTwo,
}) => {
  const [isFavourite, setIsFavourite] = useState(
    favouriteTokens.find((item) => item.name === token.name) !== undefined
  );

  return (
    <div
      className={`px-3 py-3 hover:bg-[#3b4555] ${
        currentToken === token ? "bg-[#3b4555]" : ""
      } transition-all duration-300 rounded-xl flex gap-3 items-center justify-between`}
      onClick={() => {
        if (currentTokenTwo !== token) {
          setToken(token);
          setOpenTokenListOne(false);
          setBlurScreen(false);
        }
      }}
    >
      <div className="flex items-center gap-3">
        <img src={token.tokenImage === undefined ? '/tokens/EmptyToken.webp' : token.tokenImage} alt="" className="h-8 w-8" />
        <div>
          <div className="text-sm text-white">{token.tokenSymbol}</div>
          <div className="text-xs text-gray-400">{token.tokenName}</div>
        </div>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => setIsFavourite(!isFavourite)}
      >
        <FaStar color={!isFavourite ? "#fcd53f" : "#828790"} />
      </div>
    </div>
  );
};

export default SingleTokenListModal;
