
$(document).ready(function () {
    $("#solicitar-servico").submit(function (e) {
        var descricaoResumida = $("#descricao-resumida").val();
        var descricao = $("#descricao").val();
        var valor = $("#valor").val();
  
        adicionarServico(descricaoResumida,
                            descricao,toBlockChainDecimal(valor),"GvS",

            () => {
                //$("#valor").val('');
                mensagemSucesso($("#depositoForm fieldset"), "Serviço adicionar.");
            },
            (msgErro) => {
                mensagemErro($("#depositoForm fieldset"), msgErro);
            }
        );

        return false;
    });
});

async function solicitarServico(descricaoResumida, descricao, valor, tipo){
    console.log(servico);
    await adicionarServico(descricaoResumida, descricao, valor, tipo);
}
