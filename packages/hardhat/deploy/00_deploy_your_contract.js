// deploy/00_deploy_your_contract.js
import { ethers } from "ethers";

// use apis and store the variables as globals
// find the latest price of ETH
// find the latest gas price

export default async ({ deployments }) => {

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const TenKLosers = await deploy("TenKLosers", {
    from: deployer,
    args: [],
    log: true,
  });

  const gasToEtH = (gas) => {
    let Gas;
    let Gwei = 80;

    if (typeof gas === 'object') Gas = gas.toString()
    else Gas = gas;

    const costInETH = (Gas * 0.000000001) * Gwei;

    console.log("Gas Used >>>", Gas);
    console.log("Price in USD (ETH @ 4200) >>>", ethers.utils.commify((costInETH * 4200)))
    console.log(`Gas Cost in ETH @ ${Gwei} gwei >>>`, (costInETH).toFixed(4) + " ETH")
  }

  gasToEtH(TenKLosers.receipt.gasUsed)

  // used to update ethernal local blockchain explor

  // await hre.ethernal.push({
  //   name: 'DesperateApeWives',
  //   address: DAW.address
  // });

};

export const tags = ["TenKLosers"];
