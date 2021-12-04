// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (token/ERC1155/ERC1155.sol)

pragma solidity ^0.8.0;

/*
   _____ _    _  __  _  _ ___ _____   ___ _____ _   _  _____ 
 |_   _| |  | |/ / | \| | __|_   _| / __|_   _/_\ | |/ / __|
   | | | |__| ' <  | .` | _|  | |   \__ \ | |/ _ \| ' <| _| 
   |_| |____|_|\_\ |_|\_|_|   |_|   |___/ |_/_/ \_\_|\_\___|
                                                            
 */
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// TODO Remove Hardhat console
import "hardhat/console.sol";

// import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
// import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
// import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
// import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
// import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
// import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract TLKNFTStake is IERC721Receiver, Context, Ownable, Pausable {
    using SafeMath for uint256;
    using Address for address;

    IERC721 public immutable _TLKGenesis;
    IERC721 public immutable _TLKPlayers;
    IERC20 public immutable _TLKTokens;

    // structure to track the staked tokens
    struct Staked {
        uint256 tokenId;    // the NFT ID that is being staked
        uint256 tokenType;  // 1 = TLKGenesis, 2 = TLKPlayers
        uint256 stakeTime;  // the timestamp when the stake was started
        uint256 lastClaimed;  // the timestamp when the last claim was made
        uint256 claimed;    // how much was claimed since staking started
    }

    uint256 public _totalTLKGensisStaked = 0;
    uint256 public _totalTLKPlayersStaked = 0;

    // maps NFT stakes per wallet
    mapping(address => Staked[]) public staked; 
    // // tracks location of each NFT in staked
    // mapping(uint256 => uint256) public GenesisIndices; 

    mapping(address => bool) private _admins;

    // TLKGenesis NFTs earn 5 TLK TOKENS per day
    uint256 public GENESIS_DAILY_RATE = 5 ** 2;

    // TLKPlayers NFTs earn 1 TLK TOKEN per day
    uint256 public PLAYERS_DAILY_RATE = 1 ** 2;

    // Events for the blockchain
    event TLKGenesisStaked(address owner, uint256 tokenId);
    event TLKPlayerStaked(address owner, uint256 tokenId);
    event TLKTokenClaimed(address owner, uint256 value);

    constructor(address[] memory admins, address TLKGenesis, address TLKPlayers, address TLKTokens) {
        // Set the NFT addresses
        _TLKGenesis = IERC721(TLKGenesis);
        _TLKPlayers = IERC721(TLKPlayers);
        _TLKTokens = IERC20(TLKTokens);

        // set the admins from the array passed into the constructor
        for(uint256 i = 0; i < admins.length; i++) {
            _admins[admins[i]] = true;
        }
        // Set the owner as an admin
        _admins[_msgSender()] = true;
    }

    /** Modifiers */
    modifier onlyAdmin() {
        require(_admins[_msgSender()] == true, "Nice try! You need to be an admin");
        _;
    }

    function setEarnRates(uint256 gensisDailyRate, uint256 playerDailyRate) external onlyAdmin() {
        GENESIS_DAILY_RATE = gensisDailyRate;
        PLAYERS_DAILY_RATE = playerDailyRate;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override pure returns (bytes4) {
        operator;
        from;
        tokenId;
        data;
        return IERC721Receiver.onERC721Received.selector;
    }

    function setAdmin(address addr, bool admin) external onlyOwner {
        _admins[addr] = admin;
    }

    function isAdmin(address addr) external view onlyAdmin returns (bool) {
        return _admins[addr];
    }

    // Allow for the recovery of tokens sent to the contract address
    function safeTransferETH(address to, uint256 value) public onlyOwner() {
        (bool success,) = to.call{value:value}(new bytes(0));
        require(success, 'TransferHelper: ETH_TRANSFER_FAILED');
    }

    function safeTransfer(address token, address to, uint256 value) public onlyOwner() {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FAILED');
    }

    function stakeTLKGenesis(uint256 id) external {
        // Allow for the staking of the GenesisNFT
        require(id > 0, 'stakeTLKGensis must be a valid ID');
        // Make sure the NFT is owned by the calling wallet
        require(_TLKGenesis.ownerOf(id) == _msgSender(), "ERROR: You do not own this NFT!");

        // Transfer the Genesis NFT to the staking contract
        _TLKGenesis.safeTransferFrom(_msgSender(),address(this),id);

        // Track the staking in the array
        staked[_msgSender()].push(Staked({
        tokenId: id,
        tokenType: 1, // 1 = TLKGenesis, 2 = TLKPlayers
        stakeTime: block.timestamp, 
        lastClaimed: block.timestamp, 
        claimed: 0})); 
        emit TLKGenesisStaked(_msgSender(), id);
    }

    // function unstakeTLKGenesis(uint256 id) external {
    //     // Check owner
    //     require(_stakedOwner(_msgSender(), 1, id), "ERROR: You are not the owner of this NFT");
    // }

    function _stakedOwner(address wallet, uint256 nftType, uint256 id) internal view returns (bool) {
        bool owned = false;     // set the default return value to false (not owned)
        // check the staked array for the wallet provided and see if the NFT type is staked
        if (staked[wallet].length > 0) {
            // loop through the staked NFTs and see if we find a match
            for(uint256 i = 0; i < staked[wallet].length; i++) {
                // check to make sure the current entry is of the same NFT type
                if (staked[wallet][i].tokenType == nftType) {
                    // we have the correct type, let's see if it's the correct id
                    if (staked[wallet][i].tokenId == id) {
                        // we have a match on the token ID.  This token is staked!
                        owned = true;
                    }
                }
            }
        }
        return owned;
    }

    function _claimStake(address wallet, uint256 nftType, uint256 id) internal view returns (bool) {
        // does not check ownership first, need to call _stakedOwner before calling this method
        uint256 owed = 0;

        // loop through the staked NFTs until we find a match
        for(uint256 i = 0; i < staked[wallet].length; i++) {
            // check to make sure the current entry is of the same NFT type
            if (staked[wallet][i].tokenType == nftType) {
                // we have the correct type, let's see if it's the correct id
                if (staked[wallet][i].tokenId == id) {
                    // we have a match on the token ID.

                    // calculate the amount owned
                    owed = (block.timestamp - staked[wallet][i].lastClaimed) * GENESIS_DAILY_RATE / 1 days;
                    console.log("Owed = ", owed);
                    // owed = (lastClaimTimestamp - stake.value) * GENESIS_DAILY_RATE / 1 days; // stop earning additional coins if it's all claimed
                }
            }
        }
        return true;
    }
}