const jsonPathAgenteFederado = '../../abis/AgenteFederado.json?v=' + versaoJavascriptGlobal;

async function consultarExtratoAgenteFederado(endereco) {
    var agenteFederado = await obterContrato(jsonPathAgenteFederado);

    if (agenteFederado == null)
        return;

    extrato = await agenteFederado.methods.consultarExtrato(endereco).call();

    return extrato;
}

async function cadastrarAgenteFederado(uf, descricao, enderecoCarteira, receiptFunc, errorFunc) {
    var agenteFederado = await obterContrato(jsonPathAgenteFederado);

    if (agenteFederado == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    agenteFederadoInfo = {
        dataCadastro: 0,
        uf: uf,
        descricao: descricao,
        enderecoCarteira: enderecoCarteira,
        cadastrado: true
    }

    var conta = await obterContaWeb3();

    agenteFederado.methods.cadastrarAgenteFederado(agenteFederadoInfo).send({ from: conta })
        .on('receipt', (receipt) => {
            if (receiptFunc != null)
                receiptFunc(receipt);
        })
        .on('error', (error) => {
            console.log(error);
            if (errorFunc != null)
                errorFunc(error.message);
        })
}

async function cadastrarSecretaria(descricao, enderecoCarteira, receiptFunc, errorFunc) {
    var agenteFederado = await obterContrato(jsonPathAgenteFederado);

    if (agenteFederado == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    var conta = await obterContaWeb3();

    secretariaInfo = {
        descricao: descricao,
        enderecoCarteira: enderecoCarteira,
        enderecoAgenteFederado: conta,
        cadastrado: true,
        dataCadastro: 0
    };

    agenteFederado.methods.cadastrarSecretaria(secretariaInfo).send({ from: conta })
        .on('receipt', (receipt) => {
            if (receiptFunc != null)
                receiptFunc(receipt);
        })
        .on('error', (error) => {
            console.log(error);
            if (errorFunc != null)
                errorFunc(error.message);
        })
}

async function listarAgentesFederados() {
    var agenteFederado = await obterContrato(jsonPathAgenteFederado);

    if (agenteFederado == null)
        return;

    return await agenteFederado.methods.listarAgentesFederados().call();
}

async function listarSecretariasAgenteFederado(enderecoAgenteFederado) {
    var agenteFederado = await obterContrato(jsonPathAgenteFederado);

    if (agenteFederado == null)
        return;

    return await agenteFederado.methods.listarSecretariasAgenteFederado(enderecoAgenteFederado).call();
}

async function obterAgenteFederado(enderecoCarteira) {
    var agenteFederado = await obterContrato(jsonPathAgenteFederado);

    if (agenteFederado == null)
        return;

    return await agenteFederado.methods.obterAgenteFederado(enderecoCarteira).call();
}

async function obterSecretaria(enderecoCarteira) {
    var agenteFederado = await obterContrato(jsonPathAgenteFederado);

    if (agenteFederado == null)
        return;

    return await agenteFederado.methods.obterSecretaria(enderecoCarteira).call();
}

async function setOwnerAgenteFederado(endereco, ehDono) {
    var agenteFederado = await obterContrato(jsonPathAgenteFederado);

    if (agenteFederado == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    var conta = await obterContaWeb3();

    agenteFederado.methods.setOwner(endereco, ehDono).send({ from: conta })
        .on('receipt', (receipt) => {
            alert('Dono setado.')
        })
        .on('error', (error) => {
            console.log(error);
            alert(error.message);
        })
}
