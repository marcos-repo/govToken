//Para publicar o Gov
const GovToken = artifacts.require("GovToken");
const GovEducacaoToken = artifacts.require("GovEducacaoToken");
const GovSaudeToken = artifacts.require("GovSaudeToken");
const ContaLastro = artifacts.require("ContaLastro");
const PainelServico = artifacts.require("PainelServico");

module.exports = async function (deployer) {
  await deployer.deploy(GovToken);
  govTokenInstance = await GovToken.deployed();

  await deployer.deploy(GovEducacaoToken);
  govEducacaoTokenInstance = await GovEducacaoToken.deployed();
  
  await deployer.deploy(GovSaudeToken);
  govSaudeTokenInstance = await GovSaudeToken.deployed();

  await deployer.deploy(ContaLastro, GovToken.address, GovEducacaoToken.address, GovSaudeToken.address);
  await ContaLastro.deployed();

  await deployer.deploy(PainelServico);
  painelServicoInstance = await PainelServico.deployed();

  await govTokenInstance.setMintOwner(ContaLastro.address);
  await govEducacaoTokenInstance.setMintOwner(ContaLastro.address);
  await govSaudeTokenInstance.setMintOwner(ContaLastro.address);
  
  //await painelServicoInstance.setMintOwner(PainelServico.address);
};