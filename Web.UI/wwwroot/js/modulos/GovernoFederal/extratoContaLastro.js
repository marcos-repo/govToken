(async function carregarEventos() {
    bindEventoContaAlterada(() => {
        carregarGridExtrato();
        carregarSaldo();
    });

    bindEventoRedeAlterada(() => {
        carregarGridExtrato();
        carregarSaldo();
    });

    bindEventoDepositoContaLastroRealizado(
        (event) => {
            console.log(event);
            carregarGridExtrato();
            carregarSaldo();
        },
        (error) => {
            console.log(error.message);
        }
    );
})();

$(document).ready(function () {
    carregarSaldo();
    carregarGridExtrato();
});

async function carregarGridExtrato() {
    $("#mytable tbody").html(loadingGrid);
    var extrato = await consultarExtratoContaLastro();
    $("#mytable tbody").html("");

    for (var i in extrato) {
        var tr = $("<tr class='data-item'>");

        if (extrato[i].creditoDebito == "C") {
            tr.attr("style", "color: green;");
        }
        else {
            tr.attr("style", "color: red;");
        }

        var valor = fromBlockChainDecimal(extrato[i].valor);
        var data = fromBlockChainDate(extrato[i].data);
        var simbolo = extrato[i].simboloToken;

        tr.append($("<td class='text-center'>").text(formatarDataHoraPadraoPtBR(data)));
        tr.append($("<td class='text-center'>").html(extrato[i].descricao.replace(/\|/g, "<br>")));
        tr.append($("<td class='text-center'>").text(simbolo + " " + formatarDecimalMilhar(valor, 2)));

        $("#mytable tbody").append(tr);
    }
}

async function carregarSaldo() {
    var enderecoContaLastro = await obterEnderecoContaLastro();
    var saldoGovToken = await obterSaldoGovToken(enderecoContaLastro);
    var saldo = await consultarSaldoContaLastro();

    $("#spSaldo").html(`Saldo: R$ ${formatarDecimalMilhar(saldo, 2)} | GvT ${formatarDecimalMilhar(saldoGovToken, 2)}`);
}

function limitarTexto(texto, tamanho) {
    if (texto.length > tamanho) {
        return texto.substring(0, tamanho) + "...";
    }

    return texto;
}