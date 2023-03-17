(async function carregarEventos() {
    bindEventoRedeAlterada(() => {
        removerMensagemSucessoErro();
        carregarAgenteFederadoSecretaria();
    });

    bindEventoContaAlterada(() => {
        removerMensagemSucessoErro();
        carregarAgenteFederadoSecretaria();
    })
})();


$(document).ready(function () {
    carregarAgenteFederadoSecretaria();

    $("#solicitar-servico").submit(function (e) {
        removerMensagemSucessoErro();

        var descricaoResumida = $("#descricao-resumida").val();
        var descricao = $("#descricao").val();
        var valor = $("#valor").val();

        adicionarServico(descricaoResumida,
            descricao,
            valor,
            () => {
                $("#solicitar-servico").trigger("reset");
                mensagemSucesso($("#solicitar-servico fieldset"), "Serviço solicitado com sucesso.");
                carregarAgenteFederadoSecretaria();
            },
            (msgErro) => {
                mensagemErro($("#solicitar-servico fieldset"), msgErro);
            }
        );

        return false;
    });
});

async function carregarAgenteFederadoSecretaria() {
    var conta = await obterContaWeb3();

    var secretaria = await obterSecretaria(conta);
    var agenteFederado = await obterAgenteFederado(secretaria.enderecoAgenteFederado);

    if (!secretaria.cadastrado) {
        mensagemErro($("#solicitar-servico fieldset"), "A carteira selecionada não é a de uma secretaria.");
        $("#ttbAgenteFederado").val("(Não é um agente federado)");
        $("#ttbSecretaria").val("(Não é uma secretaria)");
    }
    else {
        $("#ttbAgenteFederado").val(agenteFederado.descricao);
        $("#ttbSecretaria").val(secretaria.descricao);
    }
}