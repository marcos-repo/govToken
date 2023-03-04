const jsonPath = '../../abis/ContaLastro.json?v=0.0.1.1';

async function consultarExtratoContaLastro() {
    var contaLatro = await obterContrato(jsonPath);

    if (contaLatro == null)
        return;

    extrato = await contaLatro.methods.consultarExtrato().call();

    return extrato;
}

async function realizarDepositoContaLastro(valor, receiptFunc, errorFunc) {
    var contaLatro = await obterContrato(jsonPath);

    if (contaLatro == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    valor = toBlockChainDecimal(valor);
    var data = toBlockChainDate(new Date());

    var conta = await obterContaWeb3();

    contaLatro.methods.realizarDeposito(data, valor).send({ from: conta })
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

async function transferirTokenContaLastro(enderecoAgenteFederado, valor, tipoSecretaria, receiptFunc, errorFunc) {
    var contaLatro = await obterContrato(jsonPath);

    if (contaLatro == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    valor = toBlockChainDecimal(valor);
    var data = toBlockChainDate(new Date());

    var conta = await obterContaWeb3();

    contaLatro.methods.transferirToken(enderecoAgenteFederado, data, valor, tipoSecretaria).send({ from: conta })
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

async function setOwnerContaLastro(endereco, ehDono) {
    var contaLatro = await obterContrato(jsonPath);

    if (contaLatro == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    var conta = await obterContaWeb3();

    contaLatro.methods.setOwner(endereco, ehDono).send({ from: conta })
        .on('receipt', (receipt) => {
            alert('Dono setado.')
        })
        .on('error', (error) => {
            console.log(error);
            alert(error.message);
        })
}

async function bindEventoDepositoContaLastroRealizado(funcData, funcError) {
    var contaLatro = await obterContrato(jsonPath);

    if (contaLatro == null)
        return;

    contaLatro.events.depositoRealizado()
        .on('data', funcData)
        .on('error', funcError);
}
