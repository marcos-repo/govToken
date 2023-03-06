//Para publicar o Gov
const GovToken = artifacts.require("GovToken");
const GovEducacaoToken = artifacts.require("GovEducacaoToken");
const GovSaudeToken = artifacts.require("GovSaudeToken");
const AgenteFederado = artifacts.require("AgenteFederado");
const ContaLastro = artifacts.require("ContaLastro");

module.exports = async function (deployer) {
  await deployer.deploy(GovToken);
  govTokenInstance = await GovToken.deployed();

  await deployer.deploy(GovEducacaoToken);
  govEducacaoTokenInstance = await GovEducacaoToken.deployed();
  
  await deployer.deploy(GovSaudeToken);
  govSaudeTokenInstance = await GovSaudeToken.deployed();

  await deployer.deploy(AgenteFederado);
  agenteFederadoInstance = await AgenteFederado.deployed();

  await deployer.deploy(ContaLastro, GovToken.address, GovEducacaoToken.address, GovSaudeToken.address, AgenteFederado.address);
  await ContaLastro.deployed();

  await govTokenInstance.setMintOwner(ContaLastro.address);
  await govEducacaoTokenInstance.setMintOwner(ContaLastro.address);
  await govSaudeTokenInstance.setMintOwner(ContaLastro.address);
  await agenteFederadoInstance.setOwner(ContaLastro.address, true);
};