(async function carregarEventos() {    
    bindEventoDepositoSaudeRealizado(
        (event) => {
            console.log(event);
            mensagemSucesso($("#depositoForm fieldset"), "Depósito realizado.");
            $("#valor").val('');
        },
        (error) => {
            console.log(error);
            mensagemErro($("#depositoForm fieldset"), error.message);
        }
    );

    bindEventoDepositoEducacaoRealizado(
        (event) => {
            console.log(event);
            mensagemSucesso($("#depositoForm fieldset"), "Depósito realizado.");
            $("#valor").val('');
        },
        (error) => {
            console.log(error);
            mensagemErro($("#depositoForm fieldset"), error.message);
        }
    );
})();

$(document).ready(function(){
    $("#depositoForm").submit(function(e){
        var valor = $("#valor").val();
        realizarDepositoSaude(valor);
        
        return false;
    });

    $("#valor").click(function(e){
        removerMensagemSucessoErro();
    });

    $("#valor").change(function(e){
        removerMensagemSucessoErro();
    });

    $("#depositoForm").click(function(e){
        removerMensagemSucessoErro();
    });
});
