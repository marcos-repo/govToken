$(document).ready(function () {
    $("#depositoForm").submit(function (e) {
        var valor = $("#valor").val();
        realizarDepositoContaLastro(valor,
            () => {
                $("#valor").val('');
                mensagemSucesso($("#depositoForm fieldset"), "Depósito realizado.");
            },
            (msgErro) => {
                mensagemErro($("#depositoForm fieldset"), msgErro);
            }
        );

        return false;
    });

    $("#valor").click(function () {
        removerMensagemSucessoErro();
    });

    $("#valor").change(function () {
        removerMensagemSucessoErro();
    });

    $("#depositoForm").click(function () {
        removerMensagemSucessoErro();
    });
});
