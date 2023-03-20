$(document).ready(function () {
    $("#cadastrarAgenteFederadoForm").submit(function () {
        removerMensagemSucessoErro();

        var uf = $("#ddlUf").val();
        var enderecoCarteira = $("#enderecoCarteira").val();
        var descricao = $("#descricao").val();

        adicionarLoadingBotao($("#btn-salvar"), true);

        cadastrarAgenteFederado(uf, descricao, enderecoCarteira,
            () => {
                $("#cadastrarAgenteFederadoForm").trigger("reset");
                mensagemSucesso($("#cadastrarAgenteFederadoForm fieldset"), "Cadastro realizado.");
                adicionarLoadingBotao($("#btn-salvar"), false);
            },
            (msgErro) => {
                mensagemErro($("#cadastrarAgenteFederadoForm fieldset"), msgErro);
                adicionarLoadingBotao($("#btn-salvar"), false);
            }
        );

        return false;
    });

    $("#cadastrarAgenteFederadoForm input").change(function () {
        removerMensagemSucessoErro();
    });

    $("#cadastrarAgenteFederadoForm select").change(function () {
        removerMensagemSucessoErro();
    });
});
