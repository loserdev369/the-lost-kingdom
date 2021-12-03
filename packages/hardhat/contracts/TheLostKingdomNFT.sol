//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// TODO Remove Hardhat console
import "hardhat/console.sol";

// import "../interfaces/IERC2981.sol";
// pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IERC2981 is IERC165 {
  /// @notice Called with the sale price to determine how much royalty
  //          is owed and to whom.
  /// @param _tokenId - the NFT asset queried for royalty information
  /// @param _salePrice - the sale price of the NFT asset specified by _tokenId
  /// @return receiver - address of who should be sent the royalty payment
  /// @return royaltyAmount - the royalty payment amount for _salePrice
  function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
    external
    view
    returns (address receiver, uint256 royaltyAmount);
}

// import "../PaintSwapERC721.sol";
// pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

abstract contract PaintSwapERC721 is ERC721Enumerable {
  string public baseURI;

  constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

  using Strings for uint256;

  // Optional mapping for token URIs
  mapping(uint256 => string) private _tokenURIs;

  /**
   * @dev See {IERC721Metadata-tokenURI}.
   */
  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "PaintSwapERC721: URI query for nonexistent token");

    string memory _tokenURI = _tokenURIs[tokenId];
    string memory base = _baseURI();

    // If there is no base URI, return the token URI.
    if (bytes(base).length == 0) {
      return _tokenURI;
    }
    // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
    if (bytes(_tokenURI).length > 0) {
      return string(abi.encodePacked(base, _tokenURI));
    }

    return super.tokenURI(tokenId);
  }

  /**
   * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
   *
   * Requirements:
   *
   * - `tokenId` must exist.
   */
  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    require(_exists(tokenId), "PaintSwapERC721: URI set of nonexistent token");
    _tokenURIs[tokenId] = _tokenURI;
  }

  /**
   * @dev Destroys `tokenId`.
   * The approval is cleared when the token is burned.
   *
   * Requirements:
   *
   * - `tokenId` must exist.
   *
   * Emits a {Transfer} event.
   */
  function _burn(uint256 _tokenId) internal virtual override {
    super._burn(_tokenId);

    if (bytes(_tokenURIs[_tokenId]).length != 0) {
      delete _tokenURIs[_tokenId];
    }
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURI;
  }
}

// import "../ERC721.sol";
// pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TheLostKingdomNFT is PaintSwapERC721, Ownable, IERC2981 {
  using Counters for Counters.Counter;
  Counters.Counter private tokenIds;

  constructor() PaintSwapERC721("The Lost Kingdom", "TLK") {}

  function mintItem(address _to, string memory _tokenURI) public onlyOwner returns (uint256) {
    tokenIds.increment();
    // There can only ever be a maximum of 300 items minted
    assert(tokenIds.current() <= 300);

    uint256 id = tokenIds.current();
    _mint(_to, id);
    _setTokenURI(id, _tokenURI);
    return id;
  }

	function royaltyInfo(uint, uint _salePrice) external pure override returns (address, uint) {
		uint royalty = 750;
		address receiver = 0x51305Da5A03D71De4160b3a5219d1f2c4Cc50be5;
		return (receiver, (_salePrice * royalty) / 10000);
	}

  function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, IERC165) returns (bool) {
    return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
  }
}
