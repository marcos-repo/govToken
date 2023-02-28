//Para publicar o Gov
const GovEducacaoToken = artifacts.require("GovEducacaoToken");
const GovSaudeToken = artifacts.require("GovSaudeToken");
const ContaLastro = artifacts.require("ContaLastro");

module.exports = async function (deployer) {
  await deployer.deploy(GovEducacaoToken);
  govEducacaoTokenInstance = await GovEducacaoToken.deployed();
  
  await deployer.deploy(GovSaudeToken);
  govSaudeTokenInstance = await GovSaudeToken.deployed();

  await deployer.deploy(ContaLastro, GovEducacaoToken.address, GovSaudeToken.address);
  await ContaLastro.deployed();

  await govEducacaoTokenInstance.setMintOwner(ContaLastro.address);
  await govSaudeTokenInstance.setMintOwner(ContaLastro.address);
};