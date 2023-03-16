$(document).ready(function () {
    bindEventoRedeAlterada(() => {
        $("#transferenciaForm").trigger("reset");
        carregarDropdownAgenteFederado();
    });

    $("#transferenciaForm").submit(function () {
        removerMensagemSucessoErro();

        var enderecoCarteira = $("#ddlSecretaria").val();
        var valor = $("#valor").val();

        transferirTokenContaLastro(enderecoCarteira, valor,
            () => {
                $("#transferenciaForm").trigger("reset");
                mensagemSucesso($("#transferenciaForm fieldset"), "Transferência realizada.");
            },
            (msgErro) => {
                mensagemErro($("#transferenciaForm fieldset"), msgErro);
            }
        );

        return false;
    });

    $("#transferenciaForm input").change(function () {
        removerMensagemSucessoErro();
    });

    $("#transferenciaForm select").change(function () {
        removerMensagemSucessoErro();
    });

    $("#ddlAgenteFederado").change(function () {
        var enderecoAgenteFederado = $(this).val()
        carregarDropdownSecretaria(enderecoAgenteFederado);
    });

    carregarDropdownAgenteFederado();
});

async function carregarDropdownAgenteFederado() {
    $("#ddlAgenteFederado option[data-consulta]").remove();

    var agentesFederados = await listarAgentesFederados();

    for (var i in agentesFederados) {
        if (agentesFederados[i].cadastrado)
            $("#ddlAgenteFederado").append($("<option>").attr("value", agentesFederados[i].enderecoCarteira).text(agentesFederados[i].descricao).attr("data-consulta", "S"));
    }
}

async function carregarDropdownSecretaria(enderecoAgenteFederado) {
    $("#ddlSecretaria option[data-consulta]").remove();

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