(async function carregarEventos() {
    bindEventoContaAlterada(() => {
        carregarGridExtrato();
    });

    bindEventoRedeAlterada(() => {
        carregarGridExtrato();
    });

    bindEventoDepositoContaLastroRealizado(
        (event) => {
            console.log(event);
            carregarGridExtrato();
        },
        (error) => {
            console.log(error.message);
        }
    );
})();

$(document).ready(function () {
    carregarGridExtrato();
});

async function carregarGridExtrato() {
    var extrato = await consultarExtratoContaLastro();
    $("#mytable tbody").html("");

    for (var i in extrato) {
        var tr = $("<tr class='data-item'>");

        var valor = fromBlockChainDecimal(extrato[i].valor);
        var data = fromBlockChainDate(extrato[i].data);
        var simbolo = extrato[i].simboloToken;

        tr.append($("<td class='text-center'>").text(formatarDataHoraPadraoPtBR(data)));
        tr.append($("<td class='text-center'>").text(extrato[i].descricao));
        tr.append($("<td class='text-center'>").text(simbolo + " " + formatarDecimalMilhar(valor, 2)));

        $("#mytable tbody").append(tr);
    }
}
