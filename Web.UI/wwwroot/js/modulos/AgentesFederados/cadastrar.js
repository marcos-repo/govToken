$(document).ready(function () {
    $("#cadastrarAgenteFederadoForm").submit(function () {
        removerMensagemSucessoErro();

        var uf = $("#ddlUf").val();
        var enderecoCarteira = $("#enderecoCarteira").val();
        var descricao = $("#descricao").val();

        cadastrarAgenteFederado(uf, descricao, enderecoCarteira,
            () => {
                $("#cadastrarAgenteFederadoForm").trigger("reset");
                mensagemSucesso($("#cadastrarAgenteFederadoForm fieldset"), "Cadastro realizado.");
            },
            (msgErro) => {
                mensagemErro($("#cadastrarAgenteFederadoForm fieldset"), msgErro);
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
