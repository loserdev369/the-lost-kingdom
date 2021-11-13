// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

/*
 _____ _   _  __   __  _    __   _   _  ___  __  
|_   _| | | |/ / /' _/| |  /  \ | \ / || __/' _/ 
  | | | |_|   <  `._`.| |_| /\ |`\ V /'| _|`._`. 
  |_| |___|_|\_\ |___/|___|_||_|  \_/  |___|___/ 

 */
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";

contract TLKSlaves is Ownable, ERC721Enumerable {
    using SafeMath for uint256;
    using Address for address;

    // NFT configuration
    uint256 public _maxTLKSlaves = 10000;
    uint256 public _priceTLKSlaves = 11 ether;  // 11 FTM
    string private _baseURIExtended;
    string private _contractURI;
    string public PROVENANCE_HASH; // this will be the original CID from IPFS to validate Provenance of collection
    bool public PROVENANCE_LOCK = false;

    // Sale Configuration
    bool public _isSaleLive = false;
    bool internal _locked;

    // Mint index
    uint256 public _mintIndex = 1;  // The starting ID for the public mints

    // Wallet configuration
    address public _treasuryAddress;

    // Mappings
    struct TLKSlaveHolder {
        uint256 nftsReserved;
        uint256 mintedNFTs;
        bool isAdmin;
    }
    mapping(address => TLKSlaveHolder) public _accounts;

    // Contract events
    event DepositTreasury(uint256 fundsTransferred);
    event MintSlave(address owner, uint256 id);

    constructor(address[] memory admins, address treasury)
    ERC721("TLKSlaves", "TLKSlaves")
    {
        _treasuryAddress = treasury;
        _baseURIExtended = "ipfs://QmbHjsvFJT8uP64xRRSKoXuoq4VYXeRaao1VKzK3JFyEvE/";
        _accounts[msg.sender] = TLKSlaveHolder( 0, 0, true );
        _accounts[_treasuryAddress] = TLKSlaveHolder( 10000, 0, true );
        for(uint256 i = 0; i < admins.length; i++) {
            _accounts[admins[i]] = TLKSlaveHolder( 11, 0, true );
        }
    }

    // Modifiers
    modifier noReentrant() {
        require(!_locked, "No re-entrancy");
        _locked = true;
        _;
        _locked = false;
    }

    modifier onlyAdmin() {
        require(_accounts[msg.sender].isAdmin == true, "Nice try! You need to be an admin");
        _;
    }

    // Setters
    function setAdmin(address addr, bool admin, uint256 reserves) external onlyOwner {
        _accounts[addr].nftsReserved = reserves;
        _accounts[addr].isAdmin = admin;
    }

    function setProvenanceHash(string memory provenanceHash) external onlyAdmin {
        require(PROVENANCE_LOCK == false);
        PROVENANCE_HASH = provenanceHash;
    }

    function lockProvenance() external onlyAdmin {
        PROVENANCE_LOCK = true;
    }

    function setSale(bool saleMode) external onlyAdmin {
        _isSaleLive = saleMode;
    }

    function setBaseURI(string memory newURI) external onlyAdmin {
        _baseURIExtended = newURI;
    }

    function setContractURI(string memory newURI) external onlyAdmin {
        _contractURI = newURI;
    }

    function setMaxTLKSlaves(uint256 maxTLKSlaves) external onlyAdmin {
        require(maxTLKSlaves > totalSupply(), "New limit must be larger than total supply!");
        _maxTLKSlaves = maxTLKSlaves;
    }

    function setSlavePrice(uint256 slavePrice) external onlyAdmin {
        _priceTLKSlaves = slavePrice;
    }

    function setTreasury(address treasury) external onlyOwner {
        _treasuryAddress = treasury;
    }
    // End Setters

    // Getters

    function getSale() public view returns (bool) {
        return _isSaleLive;
    }

    // For OpenSea
    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    // For Metadata
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIExtended;
    }

    //
    function getTLKSlaveHolder(address _account) public view returns (uint256, uint256, bool) {
        return (_accounts[_account].nftsReserved, 
                _accounts[_account].mintedNFTs,
                _accounts[_account].isAdmin);
    }
    // End Getters

    // Business Logic
    function adminMint(uint256 amount) external onlyAdmin {
        require(_accounts[msg.sender].isAdmin == true, "Nice Try! Only an admin can mint");
        require(amount > 0, 'Need to have reserved supply');
        require(amount <= _accounts[msg.sender].nftsReserved, "Amount requested more then you have reserved");

        // console.log("totalSupply (pre): ", totalSupply());
        // console.log("MintedNFTS (pre): ", _accounts[msg.sender].mintedNFTs);
        // DO MINT
        // uint id = totalSupply();
        _accounts[msg.sender].nftsReserved.sub(amount);
        uint256 startIndex = 1;
        for (uint256 i = 0; i < amount; i++) {
            // check to see if NFT is owned
            bool minted = false;
            while (i < _maxTLKSlaves && !minted)
            {
                if (!_exists(startIndex))
                {
                    _safeMint(msg.sender, startIndex);
                    // console.log("Mint NFT ID# ", _mintIndex);
                    minted = true;
                }
                startIndex++;
            }
        }
        _accounts[msg.sender].mintedNFTs.add(amount);
        // console.log("MintedNFTS (post): ", _accounts[msg.sender].mintedNFTs);
        // console.log("totalSupply (post): ", totalSupply());
    }

    function adminMintIds(uint256[] memory mintIds) external onlyAdmin {
        require(_accounts[msg.sender].isAdmin == true, "Nice Try! Only an admin can mint");
        require(mintIds.length < _accounts[msg.sender].nftsReserved, "Request would exceed NFT reserve limit");
        // Mint NFTs
        for(uint256 i = 0; i < mintIds.length; i++) {
            require(!_exists(mintIds[i]),"This NFT is already minted and owned!");
            _safeMint(msg.sender, mintIds[i]);
        }
        _accounts[msg.sender].nftsReserved.sub(mintIds.length);
    }

    function mintSlave(uint256 mintAmount) external payable noReentrant {
        // console.log("mintAmount: ", mintAmount);
        // console.log("msg.sender: ", msg.sender);
        // console.log("mintedNFTs: ", _accounts[msg.sender].mintedNFTs);
        // CHECK BASIC SALE CONDITIONS
        require(!Address.isContract(msg.sender), "Nice try contracts can't mint");
        require(_isSaleLive, "Sale must be active");
        require(mintAmount > 0, "Must mint at least one token");
        require(totalSupply() + mintAmount <= _maxTLKSlaves, "Purchase would exceed max supply of slaves");
        require(msg.value >= _priceTLKSlaves * mintAmount, "Ether value sent is not correct");
        // console.log("totalSupply (pre): ", totalSupply());
        // console.log("MintedNFTS (pre): ", _accounts[msg.sender].mintedNFTs);
        // DO MINT
        for (uint256 i = 0; i < mintAmount; i++) {
            // check to see if NFT is owned
            bool minted = false;
            while (i < _maxTLKSlaves && !minted)
            {
                if (!_exists(_mintIndex))
                {
                    _safeMint(msg.sender, _mintIndex);
                    // console.log("Mint NFT ID# ", _mintIndex);
                    minted = true;
                    emit MintSlave(msg.sender, _mintIndex);
                }
                _mintIndex++;
            }
        }
        _accounts[msg.sender].mintedNFTs.add(mintAmount);
    }

    function depositTreasury() external onlyAdmin {
        uint256 currentBalance = address(this).balance;
        (bool success,) = _treasuryAddress.call{value: currentBalance, gas: 3000}("");
        if (success) {
            emit DepositTreasury(currentBalance);
        }
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