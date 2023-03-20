//Para publicar o Gov
const GovToken = artifacts.require("GovToken");
const AgenteFederado = artifacts.require("AgenteFederado");
const Fornecedor = artifacts.require("Fornecedor");
const ContaLastro = artifacts.require("ContaLastro");
const PainelServico = artifacts.require("PainelServico");

module.exports = async function (deployer) {
  await deployer.deploy(GovToken);
  govTokenInstance = await GovToken.deployed(); 

  await deployer.deploy(AgenteFederado);
  agenteFederadoInstance = await AgenteFederado.deployed();

  await deployer.deploy(Fornecedor);
  fornecedorInstance = await Fornecedor.deployed();

  await deployer.deploy(PainelServico, AgenteFederado.address, Fornecedor.address, GovToken.address);
  painelServicoInstance = await PainelServico.deployed();

  await deployer.deploy(ContaLastro, GovToken.address, AgenteFederado.address, PainelServico.address, Fornecedor.address);
  await ContaLastro.deployed();

  await govTokenInstance.setMintOwner(ContaLastro.address);
  await agenteFederadoInstance.setOwner(ContaLastro.address, true);
  await agenteFederadoInstance.setOwner(PainelServico.address, true);
  await painelServicoInstance.setContaLastro(ContaLastro.address);
  
  //await painelServicoInstance.setMintOwner(PainelServico.address);
};