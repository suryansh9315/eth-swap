import AviralToken from './AviralToken.json'
import SuryanshToken from './SuryanshToken.json'
import SingleSwapToken from './SingleSwapToken.json'
import MultiSwapToken from './MultiSwapToken.json'
import ERC20 from "./ERC20.json";
import GoerliERC20 from "./GoerliERC20.json";
import Factory from "./Factory.json";

export const SuryanshTokenAddress = '0x76a999d5F7EFDE0a300e710e6f52Fb0A4b61aD58'
export const SuryanshTokenABI = SuryanshToken.abi

export const AviralTokenAddress = '0x02e8910B3B89690d4aeC9fcC0Ae2cD16fB6A4828'
export const AviralTokenABI = AviralToken.abi

export const SingleSwapTokenAddress = '0x564Db7a11653228164FD03BcA60465270E67b3d7'
export const SingleSwapTokenABI = SingleSwapToken.abi

export const MultiSwapTokenAddress = '0x9abb5861e3a1eDF19C51F8Ac74A81782e94F8FdC'
export const MultiSwapTokenABI = MultiSwapToken.abi

export const ERC20ABI = ERC20
export const GoerliERC20ABI = GoerliERC20

export const POOL_ADDRESSES = {
    USDT_ETH: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640'
}

export const POOL_FACTORY_CONTRACT_ABI = Factory
export const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'

export const QUOTER_CONTRACT_ADDRESS = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e'
export const SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'