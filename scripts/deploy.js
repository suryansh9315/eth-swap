// const hre = require("hardhat");
import hre from 'hardhat'

async function main() {
  const suryanshToken = await hre.ethers.deployContract("SuryanshToken");
  await suryanshToken.waitForDeployment();
  console.log(`Deployed to ${suryanshToken.target}`);

  const aviralToken = await hre.ethers.deployContract("AviralToken");
  await aviralToken.waitForDeployment();
  console.log(`Deployed to ${aviralToken.target}`);

  const singleSwapToken = await hre.ethers.deployContract("SingleSwapToken");
  await singleSwapToken.waitForDeployment();
  console.log(`Deployed to ${singleSwapToken.target}`);

  const multiSwapToken = await hre.ethers.deployContract("MultiSwapToken");
  await multiSwapToken.waitForDeployment();
  console.log(`Deployed to ${multiSwapToken.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
