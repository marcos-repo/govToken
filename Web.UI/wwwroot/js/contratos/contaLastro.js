const jsonPathContaLastro = '../../abis/ContaLastro.json?v=' + versaoJavascriptGlobal;

async function consultarExtratoContaLastro() {
    var contaLastro = await obterContrato(jsonPathContaLastro);

    if (contaLastro == null)
        return;

    extrato = await contaLastro.methods.consultarExtrato().call();

    return extrato;
}

async function consultarSaldoContaLastro() {
    var contaLastro = await obterContrato(jsonPathContaLastro);

    if (contaLastro == null)
        return;

    saldo = await contaLastro.methods.consultarSaldo().call();

    return fromBlockChainDecimal(parseInt(saldo));
}

async function realizarDepositoContaLastro(valor, receiptFunc, errorFunc) {
    var contaLastro = await obterContrato(jsonPathContaLastro);

    if (contaLastro == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    valor = toBlockChainDecimal(valor);

    var conta = await obterContaWeb3();

    contaLastro.methods.realizarDeposito(valor).send({ from: conta })
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

async function transferirTokenContaLastro(enderecoSecretaria, valor, receiptFunc, errorFunc) {
    var contaLastro = await obterContrato(jsonPathContaLastro);

    if (contaLastro == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    valor = toBlockChainDecimal(valor);

    var conta = await obterContaWeb3();

    contaLastro.methods.transferirToken(enderecoSecretaria, valor).send({ from: conta })
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
    var contaLastro = await obterContrato(jsonPathContaLastro);

    if (contaLastro == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }

    var conta = await obterContaWeb3();

    contaLastro.methods.setOwner(endereco, ehDono).send({ from: conta })
        .on('receipt', (receipt) => {
            alert('Dono setado.')
        })
        .on('error', (error) => {
            console.log(error);
            alert(error.message);
        })
}

async function bindEventoDepositoContaLastroRealizado(funcData, funcError) {
    var contaLastro = await obterContrato(jsonPathContaLastro);

    if (contaLastro == null)
        return;

    contaLastro.events.depositoRealizado()
        .on('data', funcData)
        .on('error', funcError);
}

async function obterEnderecoContaLastro() {
    var contaLastro = await obterContrato(jsonPathContaLastro);
    return contaLastro.options.address;
}
