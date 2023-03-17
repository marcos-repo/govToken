(async function carregarEventos() {
    bindEventoContaAlterada(() => {
        removerMensagemSucessoErro();

        $("#servicos-disponiveis").html("");
        $("#servicos-em-execucao").html("");
        $("#servicos-aguardando-pagamento").html("");

        carregarPainelServicos();
    });

    bindEventoRedeAlterada(() => {
        removerMensagemSucessoErro();

        $("#servicos-disponiveis").html("");
        $("#servicos-em-execucao").html("");
        $("#servicos-aguardando-pagamento").html("");

         carregarPainelServicos();
     });

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

var fornecedor = '';

$(document).ready(function () {
    carregarPainelServicos();
});

async function carregarPainelServicos() {
    var conta = await obterContaWeb3();
    console.log('conta -> ', conta);

    fornecedor = await obterFornecedor(conta);
    console.log('fornecedor -> ', fornecedor);

    var servicos = await listarServicos();
    console.log(servicos);

    var servicosDisponiveis = servicos.filter(function (s) {
        return s.status == "0";
    });

    var servicosEmExecucao = servicos.filter(function (s) {
        return s.status == "1";
    });

    var servicosAguardandoPagamento = servicos.filter(function (s) {
        return s.status == "2";
    });

    var servicosFinalizados = servicos.filter(function (s) {
        return s.status == "3";
    });

    console.log('servicosDisponiveis -> ', servicosDisponiveis);
    console.log('servicosEmExecucao -> ', servicosEmExecucao);
    console.log('servicosAguardandoPagamento -> ', servicosAguardandoPagamento);
    console.log('servicosFinalizados -> ', servicosFinalizados);

    var painel = $("#servicos-disponiveis");
    painel.html("");

    for (var i in servicosDisponiveis) {
        painel.append(await html(servicosDisponiveis[i]));
    }

    painel = $("#servicos-em-execucao");
    painel.html("");
    for (var i in servicosEmExecucao) {
        painel.append(await html(servicosEmExecucao[i]));
    }

    painel = $("#servicos-aguardando-pagamento");
    painel.html("");
    for (var i in servicosAguardandoPagamento) {
        painel.append(await html(servicosAguardandoPagamento[i]));
    }

    configuraBotoes();
}


var visaoAgenteFederado = false;
async function html(servico) {
    var id = servico.id;
    var data = fromBlockChainDate(servico.data);
    var descricaoResumida = servico.descricaoResumida;
    var secretaria = servico.secretaria.descricao;
    var descricao = servico.descricao;
    var valor = fromBlockChainDecimal(servico.valor);
    var simboloToken = servico.simboloToken;

    var agenteFederado = await obterAgenteFederado(servico.secretaria.enderecoAgenteFederado);

    var uf = agenteFederado.uf;
    var descricaoAgenteFederado = agenteFederado.descricao;

    var visaoFornecedor = servico.visaoFornecedor;
    visaoAgenteFederado = servico.visaoAgenteFederado;

    var fornecedor = servico.fornecedor.nome == '' || visaoFornecedor ? '&nbsp;' : servico.fornecedor.nome;

    var status = servico.status;
    var classe = "";
    var bgColor = "";
    var btnLabel = "";
    var btnClass = "";
    switch (status) {
        case "0":
            classe = "primary";
            btnLabel = "Executar Serviço";
            btnClass = "executar";
            break;
        case "1":
            classe = "danger";
            bgColor = "#A90329";
            btnLabel = "Concluir/Solicitar Pagamento";
            btnClass = "concluir";
            break;
        case "2":
            classe = "success";
            bgColor = "#71843f";
            btnLabel = "Aguardando Pagamento";
            btnClass = "aguardando-pagamento";
            break;
    }

    var botao = visaoFornecedor || status == "2" ?
        '<a id="btn-' + id + '" class="btn btn-' + classe + ' btn-block btn-' + btnClass + '" data-id="' + id + '">' +
        '   <i class="fa fa-check"></i> ' + btnLabel +
        '</a>' : '';

    return '<div id="programadas-' + id + '" class="panel panel-' + classe + '">' +
        '   <div class="panel-heading" style="background-color: ' + bgColor + '; color: #FFF;">' +
        '       <h3 class="panel-title"><i class="fa fa-calendar"></i> ' + formatarDataHoraPadraoPtBR(data) + '</h3>' +
        '   </div>' +
        '   <div class="panel-body no-padding text-align-center">' +
        '       <div class="the-price">' +
        '           <h1 title="' + descricaoResumida + '">' + descricaoResumida.substr(0, 25) + '</h1>' +
        '           <small>' + descricaoAgenteFederado + ' - ' + uf + '</small><br />' +
        '           <small>' + secretaria + '</small>' +
        '           <h6>' + simboloToken + '$ ' + formatarDecimalMilhar(valor, 2) + '</h6>' +
        '           <small>' + fornecedor + '</small>' +
        '       </div>' +
        '       <p style="padding: 10px 10px 0 10px; text-align: justify">' + descricao + '</p>' +
        '   </div>' +
        '   <div class="panel-footer no-padding">' +
        botao +
        '   </div>' +
        '</div>';
}


async function executar(id) {
    removerMensagemSucessoErro();
    processando(id, true);
    await executarServico(id,
        async () => {
            await carregarPainelServicos();
            processando(id, false);
            mensagemSucesso($("#msg"), "Serviço liberado para execução com sucesso.");

        },
        (msgErro) => {
            processando(id, false);
            mensagemErro($("#msg"), msgErro);
        });
}

async function concluir(id) {
    removerMensagemSucessoErro();
    processando(id, true);
    await concluirServico(id,
        async () => {
            await carregarPainelServicos();
            processando(id, false);
            mensagemSucesso($("#msg"), "Conclusão e Solicitação de Pagamento realizadas com sucesso.");
        },
        (msgErro) => {
            processando(id, false);
            mensagemErro($("#msg"), msgErro);
        });
}

async function liberarPagamento(id) {
    removerMensagemSucessoErro();
    processando(id, true);
    await liberarPagamentoServico(id,
        async () => {
            await carregarPainelServicos();
            processando(id, false);
            mensagemSucesso($("#msg"), "Pagamento liberado com sucesso.");            
        },
        (msgErro) => {
            processando(id, false);
            mensagemErro($("#msg"), msgErro);
        });
}

function processando(id, status) {

    if (status) {
        $(".btn-executar").addClass("disabled");
        $(".btn-concluir").addClass("disabled");

        $("#btn-" + id).removeClass("disabled");
        $("#btn-" + id).unbind("click");
        $("#btn-" + id).html('<i class="fa fa-circle-o-notch fa-spin"></i> Processando...');
    }
    else {
        $(".btn-executar").removeClass("disabled");
        $(".btn-concluir").removeClass("disabled");

        bindEventos();

        $(".btn-executar").html('<i class="fa fa-check"></i> Executar Serviço');
        $(".btn-concluir").html('<i class="fa fa-check"></i> Concluir/Solicitar Pagamento');
    }
}

function bindEventos() {
    $(".btn-executar").bind("click", async function () {
        var id = $(this).data("id");
        await executar(id);
    });

    $(".btn-concluir").bind("click", async function () {
        var id = $(this).data("id");
        await concluir(id);
    });

    $(".btn-success").bind("click", async function () {
        var id = $(this).data("id");
        await liberarPagamento(id);
    });
}

function configuraBotoes() {
    bindEventos();

    if (!visaoAgenteFederado) {
        $(".btn-success").unbind("click");
        $(".btn-success").removeClass("btn");
        $(".btn-success").addClass("btn-no-click");
    }

    $(".btn-success").html('<i class="fa fa-dollar"></i> ' + (visaoAgenteFederado ? 'Liberar' : 'Aguardando ') + 'Pagamento');
    $(".btn-success").css("background-color", "#71843f");
}


