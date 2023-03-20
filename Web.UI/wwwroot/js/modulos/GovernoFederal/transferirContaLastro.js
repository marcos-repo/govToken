$(document).ready(function () {
    bindEventoRedeAlterada(() => {
        $("#transferenciaForm").trigger("reset");
        carregarDropdownAgenteFederado();
    });

    $("#transferenciaForm").submit(function () {
        realizarTransferenciaContaLastro();
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

async function realizarTransferenciaContaLastro() {
    removerMensagemSucessoErro();

    var enderecoCarteira = $("#ddlSecretaria").val();
    var valor = $("#valor").val();

    var saldo = await obterSaldoGovToken(await obterEnderecoContaLastro());

    if (saldo < valor) {
        mensagemErro($("#transferenciaForm fieldset"), "Saldo insuficiente para a transferência.");
        return;
    }

    adicionarLoadingBotao($("#btn-salvar"), true);

    transferirTokenContaLastro(enderecoCarteira, valor,
        () => {
            $("#transferenciaForm").trigger("reset");
            mensagemSucesso($("#transferenciaForm fieldset"), "Transferência realizada.");
            adicionarLoadingBotao($("#btn-salvar"), false);
        },
        (msgErro) => {
            mensagemErro($("#transferenciaForm fieldset"), msgErro);
            adicionarLoadingBotao($("#btn-salvar"), false);
        }
    );
}

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