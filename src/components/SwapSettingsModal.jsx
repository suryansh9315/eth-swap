import { useMainContext } from "../context";
import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

const SwapSettingsModal = ({ setOpenSettings }) => {
  const { blurScreen, setBlurScreen } = useMainContext();
  const [automaticSlippage, setAutomaticSlippage] = useState(true);
  const [slippage, setSlippage] = useState(0.5);

  const toggleAutomaticSlippage = () =>
    setAutomaticSlippage(!automaticSlippage);

  return (
    <div className="bg-[#1E293B] w-[500px] rounded-xl shadow-md px-6 py-6 z-10 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white text-lg">Settings</div>
          <div className="text-gray-400 text-sm">
            Adjust to your personal preferences.
          </div>
        </div>
        <div
          onClick={() => {
            setBlurScreen(false);
            setOpenSettings(false);
          }}
          className="bg-[#2b3647] hover:bg-[#3e4d6b] transition-all duration-300 px-3 py-3 rounded-full"
        >
          <MdOutlineClose color="#fff" size={20} />
        </div>
      </div>
      <div className="flex flex-col gap-3 bg-[#273143] py-4 px-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="w-[60%] flex flex-col gap-1">
            <div className="text-white text-sm">
              Automatic Slippage Tolerance
            </div>
            <div className="text-gray-400 text-xs">
              Turn off automatic slippage tolerance to adjust the value.
            </div>
          </div>
          <div
            onClick={() => {
              setSlippage(0.5);
              setAutomaticSlippage(!automaticSlippage);
            }}
            className={`cursor-pointer ${
              automaticSlippage ? "bg-[#3A83F6]" : "bg-[#3b4555]"
            } w-[56px] h-[32px] rounded-full flex items-center px-[4px] py-[4px] transition-all duration-300`}
          >
            <div
              className={`${
                automaticSlippage ? "bg-white translate-x-[24px]" : "bg-black"
              } h-[24px] w-[24px] rounded-full transition-all duration-300`}
            />
          </div>
        </div>
        <div className="h-[0.5px] w-full bg-gray-700" />
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm">Slippage</div>
            <div className="text-gray-400 text-sm">{slippage}%</div>
          </div>
          <AnimatePresence>
            {!automaticSlippage && (
              <motion.div
                key="slippageModal"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                className="flex items-center justify-around gap-1"
              >
                <div
                  onClick={() => setSlippage(0.1)}
                  className={`hover:bg-[#3b4555] ${
                    slippage === 0.1 ? "bg-[#3b4555]" : ""
                  } transition-all duration-300 px-2 py-2 rounded-xl text-white cursor-pointer`}
                >
                  0.1%
                </div>
                <div
                  onClick={() => setSlippage(0.5)}
                  className={`hover:bg-[#3b4555] ${
                    slippage === 0.5 ? "bg-[#3b4555]" : ""
                  } transition-all duration-300 px-2 py-2 rounded-xl text-white cursor-pointer`}
                >
                  0.5%
                </div>
                <div
                  onClick={() => setSlippage(1.0)}
                  className={`hover:bg-[#3b4555] ${
                    slippage === 1.0 ? "bg-[#3b4555]" : ""
                  } transition-all duration-300 px-2 py-2 rounded-xl text-white cursor-pointer`}
                >
                  1.0%
                </div>
                <input
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  placeholder="Custom"
                  className="flex flex-1 bg-[#273143] outline-none text-white px-2 py-2 rounded-xl"
                />
                <div className="text-white">%</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SwapSettingsModal;
