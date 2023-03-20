const jsonPathPainelServico = '../../abis/PainelServico.json?v=' + versaoJavascriptGlobal;

async function listarServicos() {
    var painelContrato = await obterContrato(jsonPathPainelServico);

    if (painelContrato == null)
        return;

    var conta = await obterContaWeb3();
    painel = await painelContrato.methods.listarServicos().call({ from: conta });

    return painel;
}

async function adicionarServico(
    descricaoResumida,
    descricao,
    valor,
    receiptFunc,
    errorFunc) {

    var painelServico = await obterContrato(jsonPathPainelServico);

    if (painelServico == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }
    var valorBlockchain = toBlockChainDecimal(valor);

    var conta = await obterContaWeb3();

    aprovarTransferenciaGovToken(await obterEnderecoPainelServico(), valor, () => {
        painelServico.methods.adicionarServico(descricaoResumida, descricao, valorBlockchain).send({ from: conta })
            .on('receipt', (receipt) => {
                if (receiptFunc != null)
                    receiptFunc(receipt);
            })
            .on('error', (error) => {
                console.log(error);
                if (errorFunc != null)
                    errorFunc(error.message);
            })
    }, (msgErro) => {
        if (errorFunc != null)
            errorFunc(msgErro);
    });    
}

async function executarServico(
    id,
    receiptFunc,
    errorFunc) {

    var painelServico = await obterContrato(jsonPathPainelServico);

    if (painelServico == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    var conta = await obterContaWeb3();

    painelServico.methods.executarServico(id).send({ from: conta })
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

async function concluirServico(
    id,
    receiptFunc,
    errorFunc) {

    var painelServico = await obterContrato(jsonPathPainelServico);

    if (painelServico == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    var conta = await obterContaWeb3();

    painelServico.methods.concluirSolicitarPagamentoServico(id).send({ from: conta })
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

async function liberarPagamentoServico(
    id,
    receiptFunc,
    errorFunc) {

    var painelServico = await obterContrato(jsonPathPainelServico);

    if (painelServico == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    var conta = await obterContaWeb3();

    painelServico.methods.liberarPagamentoServico(id).send({ from: conta })
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

async function obterEnderecoPainelServico() {
    var painelServico = await obterContrato(jsonPathPainelServico);
    return painelServico.options.address;
}
