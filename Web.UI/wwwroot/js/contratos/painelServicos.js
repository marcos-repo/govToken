const jsonPath = '../../abis/PainelServico.json?v=0.0.1.1.2';

async function listarServicos() {
    var painelContrato = await obterContrato(jsonPath);

    if (painelContrato == null)
        return;

    painel = await painelContrato.methods.listarServicos().call();

    return painel;
}

async function adicionarServico(
    descricaoResumida, 
    descricao,
    valor,
    tipo,
    receiptFunc, 
    errorFunc) {
    
        var painelServico = await obterContrato(jsonPath);

        if (painelServico == null) {
            errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
            return;
        }

        valor = toBlockChainDecimal(valor);
        var data = toBlockChainDate(new Date());

        var conta = await obterContaWeb3();

        painelServico.methods.adicionarServico(descricaoResumida, descricao, valor, tipo).send({ from: conta })
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

async function executarServico(
    id, 
    receiptFunc, 
    errorFunc) {
    
        var painelServico = await obterContrato(jsonPath);

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

