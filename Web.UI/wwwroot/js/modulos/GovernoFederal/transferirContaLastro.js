$(document).ready(function () {
    $("#transferenciaForm").submit(function () {
        removerMensagemSucessoErro();

        var tipoSecretaria = $("#ddlTipoSecretaria").val();
        var enderecoCarteira = $("#enderecoCarteira").val();
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
});