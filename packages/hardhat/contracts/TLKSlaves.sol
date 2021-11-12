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
    // Loser NFT configuration
    uint256 public MAX_TLKSLAVES = 10000;
    uint256 public TLKSLAVES_PRICE = 0.069 ether;
    string private _baseURIExtended;
    string private _contractURI;
    string public PROVENANCE_HASH; // this will be the original CID from IPFS to validate Provenance of collection
    bool public PROVENANCE_LOCK = false;

    // Sale Configuration
    bool public _isSaleLive = false;
    uint256 public preSale;
    uint256 public publicSale;
    bool internal locked;

    // Mint index
    uint256 public mintIndex = 100;  // The starting ID for the public mints

    // Assassinate configuration
    uint256 private maxAssassinations = 20;
    uint256 private maxTLKSlavesPerWallet = 5;
    uint256 private assassinatePerMint = 4;

    // Wallet configuration
    address public graveyardAddress = 0xa42f204fa9AB91049B130865337f27c510792EDd;
    address public treasuryAddress;

    // Mappings
    struct LoserHolder {
        uint256 nftsReserved;
        uint256 mintedNFTs;
        uint256 assassinatedNFTs;
        bool isWhitelist;
        bool isAdmin;
    }
    mapping(address => LoserHolder) public accounts;
    mapping(uint256 => uint256) public NFTtimeout;

    // Contract events
    event LoserRevoked(uint256 _id);
    event DepositTreasury(uint256 fundsTransferred);
    event MintLoser(address owner, uint256 id);
    event AssassinateLoser(address owner, uint256 id);

    constructor(address[] memory _admins, address _treasury)
    ERC721("TLKSlaves", "TLKSlaves")
    {
        treasuryAddress = _treasury;
        _baseURIExtended = "ipfs://QmbHjsvFJT8uP64xRRSKoXuoq4VYXeRaao1VKzK3JFyEvE/";
        accounts[msg.sender] = LoserHolder( 0, 0, 0, true, true );
        accounts[treasuryAddress] = LoserHolder( 10000, 0, 0, true, true );
        for(uint256 i = 0; i < _admins.length; i++) {
            accounts[_admins[i]] = LoserHolder( 11, 0, 0, true, true );
        }
        preSale = 1635224400; // Oct 26 12am CDT
        publicSale = preSale + 24 hours; // Public Sale Begins at Oct 27 12am CDT
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

    function setBaseURI(string memory _newURI) external onlyAdmin {
        _baseURIExtended = _newURI;
    }

    function setContractURI(string memory _newURI) external onlyAdmin {
        _contractURI = _newURI;
    }

    function setSale(bool _saleLive) external onlyAdmin {
        _isSaleLive = _saleLive;
    }

    function setTimeout(uint256 _id, uint256 _timestamp) external onlyAdmin {
        NFTtimeout[_id] = _timestamp;
    }

    function setMaxTLKSlaves(uint256 _maxTLKSlaves) external onlyAdmin {
        require(_maxTLKSlaves > totalSupply(), "New limit must be larger than total supply!");
        MAX_TLKSLAVES = _maxTLKSlaves;
    }

    function setLoserPrice(uint256 _loserPrice) external onlyAdmin {
        TLKSLAVES_PRICE = _loserPrice;
    }

    function setWhitelist(address[] memory _addr) external onlyAdmin {
        for(uint256 i = 0; i < _addr.length; i++) {
            accounts[_addr[i]].isWhitelist = true;
        }
    }

    function setSaleTimes(uint256[] memory _newTimes) external onlyAdmin {
        require(_newTimes.length == 2, "You need to update all times at once");
        preSale = _newTimes[0];
        publicSale = _newTimes[1];
    }

    function setGraveyard(address _graveyard) external onlyAdmin {
        graveyardAddress = _graveyard;
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasuryAddress = _treasury;
    }
    // End Setters

    // Getters

    function getTimeout(uint256 _id) public view returns (uint256) {
        return NFTtimeout[_id];
    }

    function inTimeout(uint256 _id) public view returns (bool) {
        if (block.timestamp < NFTtimeout[_id]) {
            return true;
        }
        else
        {
            return false;
        }
    }

    function getSaleTimes() public view returns (uint256, uint256) { // for the frontend
        return (preSale, publicSale);
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
    function getLoserHolder(address _account) public view returns (uint256, uint256, uint256, bool, bool) {
        return (accounts[_account].nftsReserved, 
                accounts[_account].mintedNFTs,
                accounts[_account].assassinatedNFTs,
                accounts[_account].isWhitelist,
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

    function revokeLoser(uint256 _id, uint256 _refundAmount) external payable onlyAdmin {
        require(accounts[msg.sender].isAdmin == true, "Nice Try! Only an admin can do that!");
        require(_exists(_id),"This NFT is not owned!");
        // force the transfer of the NFT to the treasury
        address currentOwner = ownerOf(_id);
        _transfer(currentOwner,treasuryAddress,_id);
        (bool success,) = currentOwner.call{value: _refundAmount, gas: 3000}("");
        if (success) {
            // Refund successful
            emit LoserRevoked(_id);
        }
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

    function mintLoser(uint256 _mintAmount, uint256 _assassinateAmount) external payable noReentrant {
        // console.log("_mintAmount: ", _mintAmount);
        // console.log("_assassinateAmount: ", _assassinateAmount);
        // console.log("msg.sender: ", msg.sender);
        // console.log("mintedNFTs: ", accounts[msg.sender].mintedNFTs);
        // console.log("assassinatedNFTs: ", accounts[msg.sender].assassinatedNFTs);
        // CHECK BASIC SALE CONDITIONS
        require(!isContract(msg.sender), "Nice try contracts can't mint");
        require(_isSaleLive, "Sale must be active");
        require(block.timestamp >= preSale, "Pre-sale has not started");
        if(block.timestamp >= preSale && block.timestamp <= publicSale) {
            require(accounts[msg.sender].isWhitelist, "Sorry you need to be on the whitelist");
        }
        require(_mintAmount > 0 || _assassinateAmount > 0, "Must mint at least one token");
        require(totalSupply() + (_mintAmount + _assassinateAmount) <= MAX_TLKSLAVES, "Purchase would exceed max supply of TLKSlaves");
        require(msg.value >= TLKSLAVES_PRICE * (_mintAmount + _assassinateAmount), "Ether value sent is not correct");
        if (_mintAmount > 0) {
            require((accounts[msg.sender].mintedNFTs + _mintAmount) <= maxTLKSlavesPerWallet, "3 is company, 4 is a crowd, 5 is the maximum number of TLKSlaves you can mint.");
        }
        if (_assassinateAmount > 0) {
            // Calculate amount of assassinations available
            uint256 assassinateRemain = (accounts[msg.sender].mintedNFTs * assassinatePerMint) - accounts[msg.sender].assassinatedNFTs;
            require(accounts[msg.sender].assassinatedNFTs + _assassinateAmount <= maxAssassinations, "Max assassinations reached. Don't you have enough blood on your hands??");
            require(assassinateRemain < _assassinateAmount, "Your assassination limit reached. You need to mint more losers!");
        }
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
                    emit MintLoser(msg.sender, mintIndex);
                }
                mintIndex++;
            }
        }
        accounts[msg.sender].mintedNFTs += _mintAmount;
        // DO ASSASSINATE
        for (uint256 i = 0; i < _assassinateAmount; i++) {
            // check to see if NFT is owned
            bool minted = false;
            while (i < MAX_TLKSLAVES && !minted)
            {
                if (!_exists(mintIndex))
                {
                    _safeMint(graveyardAddress, mintIndex);
                    // console.log("Mint NFT ID# ", mintIndex);
                    minted = true;
                    emit AssassinateLoser(msg.sender, mintIndex);
                }
                mintIndex++;
            }
        }
        accounts[msg.sender].assassinatedNFTs += _assassinateAmount;
        // console.log("MintedNFTS (post): ", accounts[msg.sender].mintedNFTs);
        // console.log("totalSupply (post): ", totalSupply());
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