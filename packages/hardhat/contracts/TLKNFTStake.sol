// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

/*
   _____ _    _  __  _  _ ___ _____   ___ _____ _   _  _____ 
 |_   _| |  | |/ / | \| | __|_   _| / __|_   _/_\ | |/ / __|
   | | | |__| ' <  | .` | _|  | |   \__ \ | |/ _ \| ' <| _| 
   |_| |____|_|\_\ |_|\_|_|   |_|   |___/ |_/_/ \_\_|\_\___|
                                                            
 */
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "hardhat/console.sol";

/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC20
 * applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */
contract TLKNFTStake is Context, Ownable {
    using SafeMath for uint256;
    using Address for address;

    mapping(address => bool) private _admins;

    IERC721 public immutable _TLKGenesis;
    IERC721 public immutable _TLKSlaves;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    constructor(IERC721 TLKGenesis, IERC721 TLKSlaves) {
        // Set the NFT addresses
        _TLKGenesis = TLKGenesis;
        _TLKSlaves = TLKSlaves;

        // Set the owner as an admin
        _admins[msg.sender] = true;
    }

    /** Modifiers */
    modifier onlyAdmin() {
        require(_admins[msg.sender] == true, "Nice try! You need to be an admin");
        _;
    }

    function setAdmin(address addr, bool admin) external onlyOwner {
        _admins[addr] = admin;
    }

    function isAdmin(address addr) external view onlyAdmin returns (bool) {
        return _admins[addr];
    }

    // Allow for the recovery of tokens sent to the contract address
    function safeTransferETH(address to, uint value) public onlyOwner() {
        (bool success,) = to.call{value:value}(new bytes(0));
        require(success, 'TransferHelper: ETH_TRANSFER_FAILED');
    }

    function safeTransfer(address token, address to, uint value) public onlyOwner() {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FAILED');
    }
}