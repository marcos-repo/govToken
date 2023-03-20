(async function carregarEventos() {
    bindEventoContaAlterada(() => {
        inicializarTela();
    });

    bindEventoRedeAlterada(() => {
        inicializarTela();
     });
})();


$(document).ready(function () {
    inicializarTela();
});

function inicializarTela() {
    removerMensagemSucessoErro();

    carregarFornecedoresSemAprovacao();
}

async function carregarFornecedoresSemAprovacao() {
    $("#mytable tbody").html(loadingGrid);
    var fornecedores = await listarFornecedoresSemAprovacao();
    $("#mytable tbody").html("");

    console.log('fornecedores -> ', fornecedores);

    if (fornecedores.length > 0) {
        for (var i in fornecedores) {
            var tr = $("<tr class='data-item'>");

            var nome = fornecedores[i].nome;
            var data = fromBlockChainDate(fornecedores[i].dataCadastro);
            var carteira = fornecedores[i].enderecoCarteira;

            tr.append($("<td class='text-center v-middle'>").text(nome));
            tr.append($("<td class='text-center v-middle'>").text(formatarDataHoraPadraoPtBR(data)));

            tr.append($("<td class='text-center v-middle'>")
                .html("<button class='btn btn-success btn-sm' data-address='" + carteira + "' href='#'><i class='fa fa-check'></i> Aprovar</button>"));

            $("#mytable tbody").append(tr);
        }

        bindEventos();
    }
    else {
        $("#mytable tbody").html(zeroItemGrid);
    }    
}

function bindEventos() {
    $(".btn-success").unbind("click");
    $(".btn-success").bind("click", async function() {
        var address = $(this).data("address");
        await aprovar(address, $(this));
    });
}

async function aprovar(carteira, botao) {
    removerMensagemSucessoErro();

    adicionarLoadingBotao(botao, true);

    await aprovarCadastro(carteira,
        async () => {
            await inicializarTela();
            mensagemSucesso($("#msg"), "Fornecedor aprovado com sucesso.");
            adicionarLoadingBotao(botao, false);
        },
        (msgErro) => {
            mensagemErro($("#msg"), msgErro);
            adicionarLoadingBotao(botao, false);
        });
}



