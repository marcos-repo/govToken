(async function carregarEventos() {
    bindEventoRedeAlterada(() => {
        removerMensagemSucessoErro();
        carregarAgenteFederado();
    });

    bindEventoContaAlterada(() => {
        removerMensagemSucessoErro();
        carregarAgenteFederado();
    })
})();

$(document).ready(function () {
    carregarAgenteFederado();

    $("#cadastrarSecretariaForm").submit(function () {
        removerMensagemSucessoErro();

        var enderecoCarteira = $("#enderecoCarteira").val();
        var descricao = $("#descricao").val();

        adicionarLoadingBotao($("#btn-salvar"), true);

        cadastrarSecretaria(descricao, enderecoCarteira,
            () => {
                $("#cadastrarSecretariaForm").trigger("reset");
                mensagemSucesso($("#cadastrarSecretariaForm fieldset"), "Cadastro realizado.");
                carregarAgenteFederado();
                adicionarLoadingBotao($("#btn-salvar"), false);
            },
            (msgErro) => {
                mensagemErro($("#cadastrarSecretariaForm fieldset"), msgErro);
                adicionarLoadingBotao($("#btn-salvar"), false);
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