const jsonPathFornecedor = '../../abis/Fornecedor.json?v=' + versaoJavascriptGlobal;

async function consultarExtratoFornecedor(endereco) {
    var fornecedor = await obterContrato(jsonPathFornecedor);

    if (fornecedor == null)
        return;

    extrato = await fornecedor.methods.consultarExtrato(endereco).call();

    return extrato;
}

async function cadastrarFornecedor(uf, nome, enderecoCarteira, receiptFunc, errorFunc) {
    var fornecedor = await obterContrato(jsonPathFornecedor);

    if (fornecedor == null) {
        errorFunc(`Contrato não encontrado na rede '${await obterRede()}'.`);
        return;
    }    

    var data = toBlockChainDate(new Date());

    fornecedorInfo = {
        dataCadastro: data,
        uf: uf,
        nome: nome,
        enderecoCarteira: enderecoCarteira,
    }

    var conta = await obterContaWeb3();

    fornecedor.methods.cadastrarFornecedor(fornecedorInfo).send({ from: conta })
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

async function listarFornecedores() {
    var fornecedor = await obterContrato(jsonPathFornecedor);

    if (fornecedor == null)
        return;

    fornecedores = await fornecedor.methods.listarFornecedores().call();
    return fornecedores;
}

async function obterFornecedor(enderecoCarteira) {
    var fornecedor = await obterContrato(jsonPathFornecedor);
    if (fornecedor == null)
        return;

    fornecedor = await fornecedor.methods.obterFornecedor(enderecoCarteira).call();

    return fornecedor;
}