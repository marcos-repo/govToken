
$(document).ready(function () {
    $("#solicitar-servico").submit(function (e) {
        removerMensagemSucessoErro();

        var descricaoResumida = $("#descricao-resumida").val();
        var descricao = $("#descricao").val();
        var valor = $("#valor").val();

        adicionarServico(descricaoResumida,
            descricao,
            valor,
            () => {
                $("#valor").val('');
                $("#descricao-resumida").val('');
                $("#descricao").val('');
                mensagemSucesso($("#solicitar-servico fieldset"), "Serviço solicitado com sucesso.");
            },
            (msgErro) => {
                mensagemErro($("#solicitar-servico fieldset"), msgErro);
            }
        );

        return false;
    });
});
