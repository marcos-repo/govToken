const jsonPath = '../../abis/ContaLastro.json';

async function consultarExtratoSaude() {
    var contaLatro = await obterContrato(jsonPath);

    if (contaLatro == null)
        return;

    var arrExtrato = [];

    const extratoSaudeCount = await contaLatro.methods.extratoSaudeCount().call();

    for (let i = 0; i < extratoSaudeCount; i++) {
        const extrato = await contaLatro.methods._extratoSaude(i).call();
        arrExtrato.push(extrato);
    }

    return arrExtrato;
}

async function realizarDepositoSaude(valor, receiptFunc, errorFunc) {
    var contaLatro = await obterContrato(jsonPath);

    if (contaLatro == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    valor = toBlockChainDecimal(valor);
    var data = toBlockChainDate(new Date());

    var conta = await obterConta();

    contaLatro.methods.realizarDepositoSaude(data, valor).send({ from: conta })
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

async function bindEventoDepositoSaudeRealizado(funcData, funcError) {
    var contaLatro = await obterContrato(jsonPath);

    if (contaLatro == null)
        return;

    contaLatro.events.depositoSaudeRealizado()
        .on('data', funcData)
        .on('error', funcError);
}

async function bindEventoDepositoEducacaoRealizado(funcData, funcError) {
    var contaLatro = await obterContrato(jsonPath);

    if (contaLatro == null)
        return;

    contaLatro.events.depositoEducacaoRealizado()
        .on('data', funcData)
        .on('error', funcError);
}
