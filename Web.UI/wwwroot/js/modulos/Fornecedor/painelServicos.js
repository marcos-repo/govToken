(async function carregarEventos() {
    // bindEventoContaAlterada(() => {
    //     carregarPainelServicos();
    // });

    // bindEventoRedeAlterada(() => {
    //     carregarPainelServicos();
    // });

    // bindEventoDepositoContaLastroRealizado(
    //     (event) => {
    //         console.log(event);
    //         carregarPainelServicos();
    //     },
    //     (error) => {
    //         console.log(error.message);
    //     }
    // );
})();

$(document).ready(function () {
    carregarPainelServicos();
});

async function carregarPainelServicos() {
    var servicos = await listarServicos();
    var painel = $("#painel-servicos");

    painel.html("");

    console.log(servicos);

    for (var i in servicos) {
        
        var disponivel = servicos[i].disponivel;
        if(!disponivel)
            continue;
        
        var id = servicos[i].id;
        var data = fromBlockChainDate(servicos[i].data);
        var descricaoResumida = servicos[i].descricaoResumida.substr(0,20);
        var secretaria = servicos[i].secretaria;
        var descricao = servicos[i].descricao;
        var valor = fromBlockChainDecimal(servicos[i].valor);
        var simboloToken = servicos[i].simboloToken;
        var uf = servicos[i].agenteFederado.uf;
        var descricaoAgenteFederado = servicos[i].agenteFederado.descricao;

        var html='<div id="programadas-'+id+'" class="col-xs-12 col-sm-6 col-md-4">' +
        '    <div class="panel panel-primary">' +
        '        <div class="panel-heading" style="color: #FFF;">' +
        '            <h3 class="panel-title"><i class="fa fa-calendar"></i> '+ formatarDataHoraPadraoPtBR(data) +'</h3>' +
        '        </div>' +
        '        <div class="panel-body no-padding text-align-center">' +
        '            <div class="the-price">' +
        '                <h1>'+ descricaoResumida +'</h1>' +
        '                <small>'+ descricaoAgenteFederado +' - '+ uf +'</small><br />' +
        '                <small>Secretaria de '+ secretaria +'</small>' +
        '                <h6>$'+ simboloToken + ' '+ formatarDecimalMilhar(valor,2) +'</h6>' +
        '            </div>' +
        '            <p style="padding: 10px 10px 0 10px; text-align: justify">'+ descricao +'</p>' +
        '        </div>' +
        '        <div class="panel-footer no-padding">' +
        '            <a class="btn btn-primary btn-block btn-executar" data-id="'+ id +'">' +
        '                <i class="fa fa-check"></i> Executar Serviço' +
        '            </a>' +
        '        </div>' + 
        '    </div>' +
        '</div>';

        
        painel.append(html);
    }

    $(".btn-executar").bind("click", async function(){
        var id = $(this).data("id");
        await executar(id);
        
        //$("#programadas-"+id).remove();
    });
}

async function executar(id){
    await executarServico(id, carregarPainelServicos());
}


