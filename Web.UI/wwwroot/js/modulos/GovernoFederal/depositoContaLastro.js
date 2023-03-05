$(document).ready(function () {
    $("#depositoForm").submit(function () {
        removerMensagemSucessoErro();

        var valor = $("#valor").val();
        realizarDepositoContaLastro(valor,
            () => {
                $("#depositoForm").trigger("reset");
                mensagemSucesso($("#depositoForm fieldset"), "Depósito realizado.");
            },
            (msgErro) => {
                mensagemErro($("#depositoForm fieldset"), msgErro);
            }
        );

        return false;
    });

    $("#depositoForm input").change(function () {
        removerMensagemSucessoErro();
    });
});
