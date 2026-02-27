import hre from "hardhat";
import fs from "fs";

async function main() {
  console.log("Deploying to BNB Testnet...");

  // Deploy Token Factory
  const Factory = await hre.ethers.getContractFactory(
    "TokenFactory"
  );
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log(
    "TokenFactory deployed to:", 
    factoryAddress
  );

  // Deploy Vault
  const [deployer] = await hre.ethers.getSigners();
  const Vault = await hre.ethers.getContractFactory(
    "Vault"
  );
  // Deploy with sample token address and milestones
  const vault = await Vault.deploy(
    factoryAddress,  // Use factory as token address for now
    deployer.address,  // Founder is the deployer
    "Launch Product",  // Milestone 1 - 20%
    "Reach 1000 Users",  // Milestone 2 - 30%
    "Hit $1M Volume"  // Milestone 3 - 50%
  );
  await vault.waitForDeployment();
  
  const vaultAddress = await vault.getAddress();
  console.log(
    "Vault deployed to:", 
    vaultAddress
  );

  console.log("\n=== CONTRACT ADDRESSES ===");
  console.log("TokenFactory:", factoryAddress);
  console.log("Vault:", vaultAddress);
  console.log("========================\n");

  // Save deployment info to file
  const deploymentInfo = {
    network: "bscTestnet",
    timestamp: new Date().toISOString(),
    TokenFactory: factoryAddress,
    Vault: vaultAddress
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployment.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
