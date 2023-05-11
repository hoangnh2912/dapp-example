// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    struct NFTData {
        uint256 tokenId;
        string name;
        string description;
        string image;
    }

    mapping(uint256 => NFTData) _data;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    function mint(
        uint256 tokenId,
        string calldata name,
        string calldata des,
        string calldata image
    ) external {
        _mint(msg.sender, tokenId);
        _data[tokenId] = NFTData(tokenId, name, des, image);
    }

    function tokenData(uint256 tokenId) public view returns (NFTData memory) {
        return _data[tokenId];
    }
}
