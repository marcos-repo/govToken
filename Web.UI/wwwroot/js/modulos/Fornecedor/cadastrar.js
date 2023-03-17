$(document).ready(function () {
    $("#cadastrarFornecedorForm").submit(function () {
        removerMensagemSucessoErro();

        var uf = $("#ddlUf").val();
        var nome = $("#nome").val();

        cadastrarFornecedor(uf, nome,
            () => {
                $("#cadastrarFornecedorForm").trigger("reset");
                mensagemSucesso($("#cadastrarFornecedorForm fieldset"), "Cadastro realizado.");
            },
            (msgErro) => {
                mensagemErro($("#cadastrarFornecedorForm fieldset"), msgErro);
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
