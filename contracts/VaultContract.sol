// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// This locks coins until milestones hit
contract Vault {
    address public founder;
    address public token;
    uint256 public totalLocked;
    
    // 3 milestones
    struct Milestone {
        string description;
        uint256 unlockPercent;
        bool completed;
    }
    
    Milestone[3] public milestones;
    
    event CoinsUnlocked(
        uint256 amount, 
        string milestone
    );
    
    constructor(
        address _token,
        address _founder,
        string memory m1,
        string memory m2,
        string memory m3
    ) {
        token = _token;
        founder = _founder;
        
        // Set milestones with unlock %
        milestones[0] = Milestone(m1, 20, false);
        milestones[1] = Milestone(m2, 30, false);
        milestones[2] = Milestone(m3, 50, false);
    }
    
    // Lock coins in vault
    function lockCoins(uint256 amount) public {
        IERC20(token).transferFrom(
            msg.sender, 
            address(this), 
            amount
        );
        totalLocked += amount;
    }
    
    // Unlock when milestone hit
    // Only you (the platform) can call this
    function unlockMilestone(
        uint256 milestoneIndex
    ) public {
        Milestone storage m = 
            milestones[milestoneIndex];
        
        require(!m.completed, "Already unlocked");
        
        m.completed = true;
        
        uint256 unlockAmount = 
            (totalLocked * m.unlockPercent) / 100;
        
        // Send coins to founder
        IERC20(token).transfer(founder, unlockAmount);
        
        emit CoinsUnlocked(unlockAmount, m.description);
    }
    
    // Check vault balance
    function getLockedAmount() 
    public view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}
