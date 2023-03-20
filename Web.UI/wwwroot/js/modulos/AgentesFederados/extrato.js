(async function carregarEventos() {
    bindEventoRedeAlterada(() => {
        resetarConsultarExtratoAgenteFederado();
    });
})();

$(document).ready(function () {
    $("#ddlAgenteFederado").change(function () {
        carregarGridExtrato($(this).val());
    });

    carregarDropdownAgenteFederado();
});

async function carregarGridExtrato(endereco) {
    $("#tblExtrato tbody").html("");

    if (endereco == null || endereco == '')
        return;

    var extrato = await consultarExtratoAgenteFederado(endereco);

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
        tr.append($("<td class='text-center'>").text(extrato[i].descricao));
        tr.append($("<td class='text-center'>").text(simbolo + " " + formatarDecimalMilhar(valor, 2)));

        $("#tblExtrato tbody").append(tr);
    }
}

async function carregarDropdownAgenteFederado() {
    $("#ddlAgenteFederado option[data-consulta]").remove();

    var agentesFederados = await listarAgentesFederados();

    for (var i in agentesFederados) {
        if (agentesFederados[i].cadastrado)
            $("#ddlAgenteFederado").append($("<option>").attr("value", agentesFederados[i].enderecoCarteira).text(agentesFederados[i].descricao).attr("data-consulta", "S"));
    }
}

async function resetarConsultarExtratoAgenteFederado() {
    $("#ddlAgenteFederado").val("");
    $("#tblExtrato tbody").html("");
    carregarDropdownAgenteFederado();
}
