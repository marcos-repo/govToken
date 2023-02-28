$(document).ready(function () {
    carregarGridExtrato();
});


async function carregarGridExtrato() {
    var extrato = await consultarExtratoSaude();
    $("#mytable tbody").html("");

    for (var i in extrato) {
        var tr = $("<tr class='data-item'>");

        var valor = fromBlockChainDecimal(extrato[i].valor);
        var data = fromBlockChainDate(extrato[i].data);

        tr.append($("<td class='text-center'>").text(formatarDataHoraPadraoPtBR(data)));
        tr.append($("<td class='text-center'>").text("Deposito"));
        tr.append($("<td class='text-center'>").text("R$ " + formatarDecimalMilhar(valor, 2)));

        $("#mytable tbody").append(tr);
    }
}

