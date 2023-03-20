$(document).ready(function () {
    $("#cadastrarFornecedorForm").submit(function () {
        removerMensagemSucessoErro();

        var uf = $("#ddlUf").val();
        var nome = $("#nome").val();

        adicionarLoadingBotao($("#btn-salvar"), true);

        cadastrarFornecedor(uf, nome,
            () => {
                $("#cadastrarFornecedorForm").trigger("reset");
                mensagemSucesso($("#cadastrarFornecedorForm fieldset"), "Cadastro realizado.");
                adicionarLoadingBotao($("#btn-salvar"), false);
            },
            (msgErro) => {
                mensagemErro($("#cadastrarFornecedorForm fieldset"), msgErro);
                adicionarLoadingBotao($("#btn-salvar"), false);
            }
        );

        return false;
    });

    $("#cadastrarFornecedorForm input").change(function () {
        removerMensagemSucessoErro();
    });

    $("#cadastrarFornecedorForm select").change(function () {
        removerMensagemSucessoErro();
    });

    console.log('listarFornecedores()',listarFornecedores());
});
