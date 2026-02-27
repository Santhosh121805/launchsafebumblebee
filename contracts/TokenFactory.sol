// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This creates new tokens
contract LaunchToken is ERC20 {
    address public founder;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 supply,
        address _founder
    ) ERC20(name, symbol) {
        founder = _founder;
        // Mint all tokens to vault
        _mint(address(this), supply * 10**18);
    }
}

// This is the main factory
contract TokenFactory {
    // Store all launched tokens
    address[] public allTokens;
    
    // When a token is launched
    event TokenLaunched(
        address tokenAddress,
        string name,
        string symbol,
        address founder
    );
    
    // Founder calls this to launch his token
    function launchToken(
        string memory name,
        string memory symbol,
        uint256 supply
    ) public returns (address) {
        
        LaunchToken token = new LaunchToken(
            name,
            symbol, 
            supply,
            msg.sender
        );
        
        allTokens.push(address(token));
        
        emit TokenLaunched(
            address(token),
            name,
            symbol,
            msg.sender
        );
        
        return address(token);
    }
    
    // Get all launched tokens
    function getAllTokens() 
    public view returns (address[] memory) {
        return allTokens;
    }
}
