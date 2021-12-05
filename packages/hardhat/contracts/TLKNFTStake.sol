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
// TODO Remove Hardhat console
import "hardhat/console.sol";

interface ITLKCoins {
    /**
     * @dev Should mint tokens to the address provided at the amount given
     * @param addr      The address of the wallet which will receive the tokens
     * @param amount    The amount of tokens to mint
     */

    function adminMint(address addr, uint256 amount) external;
    /**
     * @dev Should burn tokens from the address provided at the amount given
     * @param addr      The address of the wallet which will burn the tokens
     * @param amount    The amount of tokens to burn
     */
    function adminBurn(address addr, uint256 amount) external;
}

contract TLKNFTStake is IERC721Receiver, Context, Ownable, Pausable {
    using SafeMath for uint256;
    using Address for address;

    IERC721 public immutable _TLKGenesis;
    IERC721 public immutable _TLKPlayers;
    ITLKCoins public immutable _TLKTokens;

    // structure to track the staked tokens
    struct Staked {
        uint256 tokenId;    // the NFT ID that is being staked
        uint256 tokenType;  // 1 = TLKGenesis, 2 = TLKPlayers
        uint256 stakeTime;  // the timestamp when the stake was started
        uint256 lastClaimed;  // the timestamp when the last claim was made
        uint256 totalClaimed;    // the total amount claimed since staking started
    }

    uint256 public _totalTLKGensisStaked = 0;
    uint256 public _totalTLKPlayersStaked = 0;

    // maps NFT stakes per wallet
    mapping(address => Staked[]) public staked; 
    // // tracks location of each NFT in staked
    // mapping(uint256 => uint256) public GenesisIndices; 

    mapping(address => bool) private _admins;

    // TLKGenesis NFTs earn 5 TLK TOKENS per day
    uint256 public GENESIS_DAILY_RATE = 5 * 10**2;

    // TLKPlayers NFTs earn 1 TLK TOKEN per day
    uint256 public PLAYERS_DAILY_RATE = 1 * 10**2;

    // Events for the blockchain
    event TLKGenesisStaked(address owner, uint256 tokenId);
    event TLKPlayerStaked(address owner, uint256 tokenId);
    event TLKGenesisUnstaked(address owner, uint256 tokenId);
    event TLKPlayerUnstaked(address owner, uint256 tokenId);
    event TLKTokensClaimed(address owner, uint256 value);

    constructor(address[] memory admins, address TLKGenesis, address TLKPlayers, address TLKTokens) {
        // Set the NFT addresses
        _TLKGenesis = IERC721(TLKGenesis);
        _TLKPlayers = IERC721(TLKPlayers);
        _TLKTokens = ITLKCoins(TLKTokens);

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

    // Admin/Owner only methods
    function setEarnRates(uint256 genesisDailyRate, uint256 playerDailyRate) external onlyAdmin() {
        GENESIS_DAILY_RATE = genesisDailyRate;
        PLAYERS_DAILY_RATE = playerDailyRate;
    }

    // Allow for the recovery of tokens sent to the contract address
    function safeTransferETH(address to, uint256 value) public onlyAdmin() {
        (bool success,) = to.call{value:value}(new bytes(0));
        require(success, 'TransferHelper: ETH_TRANSFER_FAILED');
    }

    function safeTransfer(address token, address to, uint256 value) public onlyAdmin() {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FAILED');
    }

    function setAdmin(address addr, bool admin) external onlyOwner {
        _admins[addr] = admin;
    }

    function isAdmin(address addr) external view onlyAdmin returns (bool) {
        return _admins[addr];
    }

    // Public methods

    // Allow the contract to receive ERC-721s (NFTs)
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

    //to recieve ETH
    receive() external payable {}

    function stakeTLKGenesis(uint256 id) external {
        // Allow for the staking of the GenesisNFT
        require(id > 0, 'TLK Genesis NFT must be a valid ID');
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
        totalClaimed: 0})); 
        emit TLKGenesisStaked(_msgSender(), id);
    }

    function stakeTLKPlayer(uint256 id) external {
        // Allow for the staking of the PlayerNFT
        require(id > 0, 'TLK Player NFT must be a valid ID');
        // Make sure the NFT is owned by the calling wallet
        require(_TLKPlayers.ownerOf(id) == _msgSender(), "ERROR: You do not own this NFT!");

        // Transfer the Player NFT to the staking contract
        _TLKPlayers.safeTransferFrom(_msgSender(),address(this),id);

        // Track the staking in the array
        staked[_msgSender()].push(Staked({
        tokenId: id,
        tokenType: 2, // 1 = TLKGenesis, 2 = TLKPlayers
        stakeTime: block.timestamp, 
        lastClaimed: block.timestamp, 
        totalClaimed: 0})); 
        emit TLKPlayerStaked(_msgSender(), id);
    }

    function totalClaimable(address wallet) external view returns (uint256) {
        require(staked[wallet].length > 0, "ERROR: Wallet does not have any NFTs staked!");

        uint256 totalOwed = 0;
        uint256 owed = 0;
        // loop through the staked NFTs
        for(uint256 i = 0; i < staked[wallet].length; i++) {
            console.log("NFT #", i);
            owed = _amountOwed(wallet, i);
            // add this amount to the running total
            totalOwed += owed;
        }
        return totalOwed;
    }

    function claimAll() external returns (uint256) {
        uint256 totalClaimed = 0;
        totalClaimed = _claimAll();
        return totalClaimed;
    }

    function unStakeTLKGenesis(uint256 id) external {
        // Allow for the staking of the GenesisNFT
        require(id > 0, 'TLK Genesis NFT must be a valid ID');

        // Check NFT ownership and get the index
        bool owned = false;
        uint256 stakedIndex = 0;
        (owned, stakedIndex) = _stakedOwner(_msgSender(), 1, id);

        // Make sure the NFT is owned by the calling wallet
        require(owned, "ERROR: You do not own this NFT!");

        // claim anything staked for this wallet
        _claimAll();

        // Approve the Genesis NFT for transfer
        _TLKGenesis.approve(_msgSender(),id);

        // Transfer the Genesis NFT to owner from the staking contract
        _TLKGenesis.safeTransferFrom(address(this),_msgSender(),id);

        // Removed the NFT from the staked array for this wallet
        delete staked[_msgSender()][stakedIndex];
        emit TLKGenesisUnstaked(_msgSender(), id);
    }

    function unStakeTLKPlayer(uint256 id) external {
        // Allow for the staking of the GenesisNFT
        require(id > 0, 'TLK Player NFT must be a valid ID');

        // Check NFT ownership and get the index
        bool owned = false;
        uint256 stakedIndex = 0;
        (owned, stakedIndex) = _stakedOwner(_msgSender(), 2, id);

        // Make sure the NFT is owned by the calling wallet
        require(owned, "ERROR: You do not own this NFT!");

        // claim anything staked for this wallet
        _claimAll();

        // Approve the Player NFT for transfer
        _TLKPlayers.approve(_msgSender(),id);

        // Transfer the Player NFT to owner from the staking contract
        _TLKPlayers.safeTransferFrom(address(this),_msgSender(),id);

        // Removed the NFT from the staked array for this wallet
        delete staked[_msgSender()][stakedIndex];
        emit TLKPlayerUnstaked(_msgSender(), id);
    }

    // Internal methods
    function _amountOwed(address wallet, uint256 index) internal view returns (uint256) {
        uint256 CALC_RATE = 0;
        uint256 owed = 0;

        if (staked[wallet][index].tokenType == 1)
            CALC_RATE = GENESIS_DAILY_RATE;
        if (staked[wallet][index].tokenType == 2)
            CALC_RATE = PLAYERS_DAILY_RATE;

        owed = ((block.timestamp - staked[wallet][index].lastClaimed) * CALC_RATE) / 1 days;

        console.log("Owed Calculations");
        console.log("-----------------");
        console.log("Block Timestamp: %d", block.timestamp);
        console.log("Wallet: %d", wallet);
        console.log("NFT Type: %d", staked[wallet][index].tokenType);
        console.log("NFT ID: %d", staked[wallet][index].tokenId);
        console.log("Stake Time: %d", staked[wallet][index].stakeTime);
        console.log("lastClaimed: %d", staked[wallet][index].lastClaimed);
        console.log("totalClaimed: %d", staked[wallet][index].totalClaimed);
        console.log("-----------------");
        console.log("CALC_RATE: %d", CALC_RATE);
        console.log("1 days: %d", 1 days);
        console.log("Total Owed: %d", owed);
        console.log("-----------------");

        // owed = (lastClaimTimestamp - stake.value) * GENESIS_DAILY_RATE / 1 days; // stop earning additional coins if it's all claimed
        return owed;
    }

    function _claimNFT(address wallet, uint256 index, uint256 amount) internal {
        // Claim the stake on the NFT - update lastClaimed and total claimed
        staked[wallet][index].lastClaimed = block.timestamp;
        staked[wallet][index].totalClaimed += amount;
    }

    function _claimAll() internal returns (uint256) {
        require(staked[_msgSender()].length > 0, "ERROR: Wallet does not have any NFTs staked!");

        uint256 totalClaimed = 0;
        uint256 owed = 0;
        // loop through the staked NFTs
        for(uint256 i = 0; i < staked[_msgSender()].length; i++) {
            owed = _amountOwed(_msgSender(), i);
            _claimNFT(_msgSender(),i,owed);
            // add this amount to the running total
            totalClaimed += owed;
        }

        // Mint the TLK Tokens and send to the claiming wallet
        _TLKTokens.adminMint(_msgSender(), totalClaimed);
        emit TLKTokensClaimed(_msgSender(), totalClaimed);
        return totalClaimed;
    }

    function _stakedOwner(address wallet, uint256 nftType, uint256 id) internal view returns (bool, uint256) {
        bool owned = false;     // set the default return value to false (not owned)
        uint256 stakedIndex = 0; // set the default value

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
                        stakedIndex = i;
                    }
                }
            }
        }
        return (owned, stakedIndex);
    }
}