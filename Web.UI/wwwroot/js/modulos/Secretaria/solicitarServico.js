
$(document).ready(function () {
    $("#solicitar-servico").submit(function (e) {
        removerMensagemSucessoErro();

        var descricaoResumida = $("#descricao-resumida").val();
        var descricao = $("#descricao").val();
        var valor = $("#valor").val();
        var tipo = $("#secretaria").val();
        
        adicionarServico(descricaoResumida,
                         descricao,
                         valor,
                         tipo,

            () => {
                $("#valor").val('');
                $("#descricao-resumida").val('');
                $("#descricao").val('');
                $("#secretaria").val('');
                mensagemSucesso($("#solicitar-servico fieldset"), "Serviço solicitado com sucesso.");
            },
            (msgErro) => {
                mensagemErro($("#solicitar-servico fieldset"), msgErro);
            }
        );

        return false;
    });
});

async function solicitarServico(descricaoResumida, descricao, valor, tipo){
    console.log(servico);
    await adicionarServico(descricaoResumida, descricao, valor, tipo);
}
