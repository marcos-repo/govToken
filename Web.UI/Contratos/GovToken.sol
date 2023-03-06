// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract GovToken is ERC20, ERC20Burnable {
    address public _owner;
    address public _mintOwner;

    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    modifier onlyMintOwner() {
        require(msg.sender == _mintOwner);
        _;
    }

    constructor() ERC20("GovToken", "GvT") {
        _owner = msg.sender;
        _mintOwner = msg.sender;
    }

    function setMintOwner(address mintOwner) public onlyOwner {
        _mintOwner = mintOwner;
    }

    function mint(address to, uint256 amount) public onlyMintOwner {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }
}
