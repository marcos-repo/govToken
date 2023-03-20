(async function carregarEventos() {
    bindEventoRedeAlterada(() => {
        resetarConsultarExtratoSecretaria();
    });
})();

$(document).ready(function () {
    $("#ddlAgenteFederado").change(function () {
        carregarDropdownSecretaria($(this).val());
    });

    $("#ddlSecretaria").change(function () {
        carregarGridExtrato($(this).val());
        carregarSaldo($(this).val());
    });

    carregarDropdownAgenteFederado();
});

async function carregarGridExtrato(endereco) {
    $("#tblExtrato tbody").html("");

    if (endereco == null || endereco == '')
        return;

    $("#tblExtrato tbody").html(loadingGrid);
    var extrato = await consultarExtratoAgenteFederado(endereco);

    $("#tblExtrato tbody").html("");

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
    $("#ddlSecretaria option[data-consulta]").remove();

    var agentesFederados = await listarAgentesFederados();

    for (var i in agentesFederados) {
        if (agentesFederados[i].cadastrado)
            $("#ddlAgenteFederado").append($("<option>").attr("value", agentesFederados[i].enderecoCarteira).text(agentesFederados[i].descricao).attr("data-consulta", "S"));
    }
}

async function carregarDropdownSecretaria(enderecoAgenteFederado) {
    $("#ddlSecretaria option[data-consulta]").remove();
    carregarGridExtrato(null);
    carregarSaldo(null);

    var secretarias = enderecoAgenteFederado != null && enderecoAgenteFederado != ""
        ? await listarSecretariasAgenteFederado(enderecoAgenteFederado)
        : [];

    for (var i in secretarias) {
        if (secretarias[i].cadastrado)
            $("#ddlSecretaria").append($("<option>").attr("value", secretarias[i].enderecoCarteira).text(secretarias[i].descricao).attr("data-consulta", "S"));
    }

    var habilitar = enderecoAgenteFederado != null && enderecoAgenteFederado != "";

    $("#ddlSecretaria").attr("disabled", !habilitar)
}

async function resetarConsultarExtratoSecretaria() {
    $("#ddlAgenteFederado").val("");
    $("#ddlSecretaria").val("");
    $("#tblExtrato tbody").html("");
    carregarDropdownAgenteFederado();
    carregarSaldo(null);
}

async function carregarSaldo(endereco) {
    if (endereco == null || endereco == '')
        $("#spSaldo").html("");

    var saldoGovToken = await obterSaldoGovToken(endereco);

    $("#spSaldo").html("Saldo: GvT " + formatarDecimalMilhar(saldoGovToken, 2));
}