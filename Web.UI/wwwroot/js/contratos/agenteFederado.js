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

    var data = toBlockChainDate(new Date());

    agenteFederadoInfo = {
        dataCadastro: data,
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

async function listarAgentesFederados() {
    var agenteFederado = await obterContrato(jsonPathAgenteFederado);

    if (agenteFederado == null)
        return;

    agentesFederados = await agenteFederado.methods.listarAgentesFederados().call();

    return agentesFederados;
}

async function obterAgenteFederado(enderecoCarteira) {
    var agenteFederado = await obterContrato(jsonPathAgenteFederado);

    if (agenteFederado == null)
        return;

    agentesFederados = await agenteFederado.methods.obterAgenteFederado(enderecoCarteira).call();

    return agentesFederados;
}