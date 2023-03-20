$(document).ready(function () {
    $("#depositoForm").submit(function () {
        removerMensagemSucessoErro();
        var valor = $("#valor").val();

        adicionarLoadingBotao($("#btn-salvar"), true);

        realizarDepositoContaLastro(valor,
            () => {
                $("#depositoForm").trigger("reset");
                mensagemSucesso($("#depositoForm fieldset"), "Depósito realizado.");
                adicionarLoadingBotao($("#btn-salvar"), false);
            },
            (msgErro) => {
                mensagemErro($("#depositoForm fieldset"), msgErro);
                adicionarLoadingBotao($("#btn-salvar"), false);
            }
        );

        return false;
    });

    $("#depositoForm input").change(function () {
        removerMensagemSucessoErro();
    });
});
