(async function carregarEventos() {
    bindEventoRedeAlterada(() => {
        carregarAgenteFederado();
    });

    bindEventoContaAlterada(() => {
        carregarAgenteFederado();
    })
})();

$(document).ready(function () {
    carregarAgenteFederado();

    $("#cadastrarSecretariaForm").submit(function () {
        removerMensagemSucessoErro();

        var enderecoCarteira = $("#enderecoCarteira").val();
        var descricao = $("#descricao").val();

        cadastrarSecretaria(descricao, enderecoCarteira,
            () => {
                $("#cadastrarSecretariaForm").trigger("reset");
                mensagemSucesso($("#cadastrarSecretariaForm fieldset"), "Cadastro realizado.");
                carregarAgenteFederado();
            },
            (msgErro) => {
                mensagemErro($("#cadastrarSecretariaForm fieldset"), msgErro);
            }
        );

        return false;
    });

    $("#cadastrarSecretariaForm input").change(function () {
        removerMensagemSucessoErro();
    });

    $("#cadastrarSecretariaForm select").change(function () {
        removerMensagemSucessoErro();
    });
});

async function carregarAgenteFederado() {
    removerMensagemSucessoErro();

    var conta = await obterContaWeb3();

    var agenteFederado = await obterAgenteFederado(conta);

    if (!agenteFederado.cadastrado) {
        mensagemErro($("#cadastrarSecretariaForm fieldset"), "A carteira selecionada não é a de um agente federado.");
        $("#ttbAgenteFederado").val("(Não é um agente federado)");
    }
    else {
        $("#ttbAgenteFederado").val(agenteFederado.descricao);
    }
}