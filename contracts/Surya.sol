// SPDX-License-Identifier: GPL-2.0-or-later 
pragma solidity >=0.7.0 < 0.9.0;

import '../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract SuryanshToken is ERC20 {
    constructor() ERC20("SURYA", "Suryansh"){
        _mint(msg.sender, 100000 * 10 ** decimals());
    }
}