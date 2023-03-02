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

async function realizarDepositoSaude(valor) {
    var contaLatro = await obterContrato(jsonPath);

    valor = toBlockChainDecimal(valor);

    var data = toBlockChainDate(new Date());

    if (contaLatro == null)
        return;

    var conta = await obterConta();

    //Ativar loading;
    contaLatro.methods.realizarDepositoSaude(data, valor).send({ from: conta })
        .on('receipt', (receipt) => {
            //destivar loading;
        })
}

async function bindEventoDepositoSaudeRealizado(funcData, funcError) {
    var contaLatro = await obterContrato(jsonPath);

    contaLatro.events.depositoSaudeRealizado()
        .on('data', funcData)
        .on('error', funcError);
}

async function bindEventoDepositoEducacaoRealizado(funcData, funcError) {
    var contaLatro = await obterContrato(jsonPath);

    contaLatro.events.depositoEducacaoRealizado()
        .on('data', funcData)
        .on('error', funcError);
}
    