$(document).ready(function () {
    bindEventoRedeAlterada(() => {
        carregarDropdownAgenteFederado();
    });

    $("#transferenciaForm").submit(function () {
        removerMensagemSucessoErro();

        var tipoSecretaria = $("#ddlTipoSecretaria").val();
        var enderecoCarteira = $("#ddlAgenteFederado").val();
        var valor = $("#valor").val();

        transferirTokenContaLastro(enderecoCarteira, valor, tipoSecretaria,
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