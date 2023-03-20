const jsonPathGovToken = '../../abis/GovToken.json?v=' + versaoJavascriptGlobal;

async function aprovarTransferenciaGovToken(endereco, valor, receiptFunc, errorFunc) {
    var govToken = await obterContrato(jsonPathGovToken);

    if (govToken == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    valor = toBlockChainDecimal(valor);

    var conta = await obterContaWeb3();

    govToken.methods.approve(endereco, valor).send({ from: conta })
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

async function obterSaldoGovToken(endereco) {
    var govToken = await obterContrato(jsonPathGovToken);

    if (govToken == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    return fromBlockChainDecimal(parseInt(await govToken.methods.balanceOf(endereco).call()));
}