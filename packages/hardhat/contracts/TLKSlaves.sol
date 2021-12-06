// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

/*
 _____ _   _  __   __  _    __   _   _  ___  __  
|_   _| | | |/ / /' _/| |  /  \ | \ / || __/' _/ 
  | | | |_|   <  `._`.| |_| /\ |`\ V /'| _|`._`. 
  |_| |___|_|\_\ |___/|___|_||_|  \_/  |___|___/ 

 */
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";

contract TLKSlaves is Ownable, ERC721Enumerable {
    // NFT configuration
    uint256 public MAX_TLKSLAVES = 10000;
    uint256 public TLKSLAVES_PRICE = 11 ether;  // 11 FTM
    string private _baseURIExtended;
    string private _contractURI;
    string public PROVENANCE_HASH; // this will be the original CID from IPFS to validate Provenance of collection
    bool public PROVENANCE_LOCK = false;

    // Sale Configuration
    bool public _isSaleLive = false;
    bool internal locked;

    // Mint index
    uint256 public mintIndex = 1;  // The starting ID for the public mints

    // Wallet configuration
    address public treasuryAddress;

    // Mappings
    struct TLKSlaveHolder {
        uint256 nftsReserved;
        uint256 mintedNFTs;
        bool isAdmin;
    }
    mapping(address => TLKSlaveHolder) public accounts;

    // Contract events
    event DepositTreasury(uint256 fundsTransferred);
    event MintSlave(address owner, uint256 id);

    constructor(address[] memory _admins, address _treasury)
    ERC721("TLKSlaves", "TLKSlaves")
    {
        treasuryAddress = _treasury;
        _baseURIExtended = "ipfs://QmbHjsvFJT8uP64xRRSKoXuoq4VYXeRaao1VKzK3JFyEvE/";
        accounts[msg.sender] = TLKSlaveHolder( 0, 0, true );
        accounts[treasuryAddress] = TLKSlaveHolder( 10000, 0, true );
        for(uint256 i = 0; i < _admins.length; i++) {
            accounts[_admins[i]] = TLKSlaveHolder( 11, 0, true );
        }
    }

    // Modifiers
    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyAdmin() {
        require(accounts[msg.sender].isAdmin == true, "Nice try! You need to be an admin");
        _;
    }

    // Setters
    function setAdmin(address _addr, bool _admin, uint256 _reserves) external onlyOwner {
        accounts[_addr].nftsReserved = _reserves;
        accounts[_addr].isAdmin = _admin;
    }

    function setProvenanceHash(string memory _provenanceHash) external onlyAdmin {
        require(PROVENANCE_LOCK == false);
        PROVENANCE_HASH = _provenanceHash;
    }

    function lockProvenance() external onlyAdmin {
        PROVENANCE_LOCK = true;
    }

    function setSale(bool _saleMode) external onlyAdmin {
        _isSaleLive = _saleMode;
    }

    function setBaseURI(string memory _newURI) external onlyAdmin {
        _baseURIExtended = _newURI;
    }

    function setContractURI(string memory _newURI) external onlyAdmin {
        _contractURI = _newURI;
    }

    function setMaxTLKSlaves(uint256 _maxTLKSlaves) external onlyAdmin {
        require(_maxTLKSlaves > totalSupply(), "New limit must be larger than total supply!");
        MAX_TLKSLAVES = _maxTLKSlaves;
    }

    function setSlavePrice(uint256 _slavePrice) external onlyAdmin {
        TLKSLAVES_PRICE = _slavePrice;
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasuryAddress = _treasury;
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
        return (accounts[_account].nftsReserved, 
                accounts[_account].mintedNFTs,
                accounts[_account].isAdmin);
    }
    // End Getters

    // Business Logic
    function adminMint(uint256 _amount) external onlyAdmin {
        require(accounts[msg.sender].isAdmin == true, "Nice Try! Only an admin can mint");
        require(_amount > 0, 'Need to have reserved supply');
        require(_amount <= accounts[msg.sender].nftsReserved, "Amount requested more then you have reserved");

        // console.log("totalSupply (pre): ", totalSupply());
        // console.log("MintedNFTS (pre): ", accounts[msg.sender].mintedNFTs);
        // DO MINT
        // uint id = totalSupply();
        accounts[msg.sender].nftsReserved -= _amount;
        uint256 startIndex = 1;
        for (uint256 i = 0; i < _amount; i++) {
            // check to see if NFT is owned
            bool minted = false;
            while (i < MAX_TLKSLAVES && !minted)
            {
                if (!_exists(startIndex))
                {
                    _safeMint(msg.sender, startIndex);
                    // console.log("Mint NFT ID# ", mintIndex);
                    minted = true;
                }
                startIndex++;
            }
        }
        accounts[msg.sender].mintedNFTs += _amount;
        // console.log("MintedNFTS (post): ", accounts[msg.sender].mintedNFTs);
        // console.log("totalSupply (post): ", totalSupply());
    }

    function adminMintIds(uint256[] memory _mintIds) external onlyAdmin {
        require(accounts[msg.sender].isAdmin == true, "Nice Try! Only an admin can mint");
        require(_mintIds.length < accounts[msg.sender].nftsReserved, "Request would exceed NFT reserve limit");
        // Mint NFTs
        for(uint256 i = 0; i < _mintIds.length; i++) {
            require(!_exists(_mintIds[i]),"This NFT is already minted and owned!");
            _safeMint(msg.sender, _mintIds[i]);
        }
        accounts[msg.sender].nftsReserved -= _mintIds.length;
    }

    function mintSlave(uint256 _mintAmount) external payable noReentrant {
        // console.log("_mintAmount: ", _mintAmount);
        // console.log("msg.sender: ", msg.sender);
        // console.log("mintedNFTs: ", accounts[msg.sender].mintedNFTs);
        // CHECK BASIC SALE CONDITIONS
        require(!isContract(msg.sender), "Nice try contracts can't mint");
        require(_isSaleLive, "Sale must be active");
        require(_mintAmount > 0, "Must mint at least one token");
        require(totalSupply() + _mintAmount <= MAX_TLKSLAVES, "Purchase would exceed max supply of slaves");
        require(msg.value >= TLKSLAVES_PRICE * _mintAmount, "Ether value sent is not correct");
        // console.log("totalSupply (pre): ", totalSupply());
        // console.log("MintedNFTS (pre): ", accounts[msg.sender].mintedNFTs);
        // DO MINT
        for (uint256 i = 0; i < _mintAmount; i++) {
            // check to see if NFT is owned
            bool minted = false;
            while (i < MAX_TLKSLAVES && !minted)
            {
                if (!_exists(mintIndex))
                {
                    _safeMint(msg.sender, mintIndex);
                    // console.log("Mint NFT ID# ", mintIndex);
                    minted = true;
                    emit MintSlave(msg.sender, mintIndex);
                }
                mintIndex++;
            }
        }
        accounts[msg.sender].mintedNFTs += _mintAmount;
    }

    function depositTreasury() external onlyAdmin {
        uint256 currentBalance = address(this).balance;
        (bool success,) = treasuryAddress.call{value: currentBalance, gas: 3000}("");
        if (success) {
            emit DepositTreasury(currentBalance);
        }
    }

    // Helper functions
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}