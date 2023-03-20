// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TiposComuns.sol";
import "./AgenteFederado.sol";
import "./Fornecedor.sol";
import "./ContaLastro.sol";
import "./GovToken.sol";
import "./StringUtils.sol";

contract PainelServico {
    //Propriedades
    ServicoInfo[] private _listaServicos;
    uint256 private _id = 0;

    AgenteFederado private _agenteFederado;
    ContaLastro private _contaLastro;
    Fornecedor private _fornecedor;
    StringUtils private _string;
    GovToken private _govToken;

    //Construtores
    constructor(
        AgenteFederado agenteFederado,
        Fornecedor fornecedor,
        GovToken govToken
    ) {
        _agenteFederado = agenteFederado;
        _fornecedor = fornecedor;
        _govToken = govToken;
        _string = new StringUtils();
    }

    //Modificadores
    modifier onlyOwner() {
        //require(_owners[msg.sender] == true);
        _;
    }

    modifier onlySupplier() {
        require(
            _fornecedor.obterFornecedor(msg.sender).cadastrado,
            unicode"Operação permitida apenas para Fornecedores."
        );
        _;
    }

    modifier onlySecretary() {
        require(
            _agenteFederado.obterSecretaria(msg.sender).cadastrado,
            unicode"Operação permitida apenas para uma Secretaria."
        );
        _;
    }

    //Eventos
    event servicoAdicionado(ServicoInfo servico);

    //Funções
    function setContaLastro(ContaLastro contaLastro) public onlyOwner {
        require(
            address(_contaLastro) == address(0),
            unicode"A conta lastro já foi setada."
        );
        _contaLastro = contaLastro;
    }

    function setOwner(address owner, bool isOwner) public onlyOwner {
        //_owners[owner] = isOwner;
    }

    function listarServicos2() public view returns (ServicoInfo[] memory) {
        return _listaServicos;
    }

    function listarServicos()
        public
        view
        returns (ServicoInfo[] memory listaServicos)
    {
        FornecedorInfo memory fornecedor = _fornecedor.obterFornecedor(
            msg.sender
        );

        bool isFornecedor = fornecedor.cadastrado && fornecedor.aprovado;
        bool isAgenteFederado = _agenteFederado
            .obterSecretaria(msg.sender)
            .cadastrado;

        uint256 qtdServicos = _listaServicos.length;
        uint256 qtdeServicosFiltrados = 0;

        for (uint256 i = 0; i < qtdServicos; i++) {
            ServicoInfo memory servico = _listaServicos[i];

            bool exibirFornecedor = isFornecedor &&
                (servico.executor == msg.sender ||
                    servico.status == StatusServicoEnum.Disponivel);

            bool exibirAgenteFederado = isAgenteFederado &&
                servico.solicitante == msg.sender;

            if (
                servico.status != StatusServicoEnum.Finalizado &&
                (exibirFornecedor || exibirAgenteFederado)
            ) {
                qtdeServicosFiltrados++;
            }
        }

        if (qtdeServicosFiltrados == 0) return listaServicos;

        listaServicos = new ServicoInfo[](qtdeServicosFiltrados);
        uint256 j = 0;
        for (uint256 i = 0; i < qtdServicos; i++) {
            ServicoInfo memory servico = _listaServicos[i];

            bool exibirFornecedor = isFornecedor &&
                (servico.executor == msg.sender ||
                    servico.status == StatusServicoEnum.Disponivel);

            bool exibirAgenteFederado = isAgenteFederado &&
                servico.solicitante == msg.sender;

            if (
                servico.status != StatusServicoEnum.Finalizado &&
                (exibirFornecedor || exibirAgenteFederado)
            ) {
                servico.visaoFornecedor = exibirFornecedor;
                servico.visaoAgenteFederado = exibirAgenteFederado;
                listaServicos[j] = servico;
                j++;
            }
        }

        return listaServicos;
    }

    function adicionarServico(
        string memory descricaoResumida,
        string memory descricao,
        uint256 valor
    ) public {
        SecretariaInfo memory secretaria = _agenteFederado.obterSecretaria(
            msg.sender
        );

        require(
            secretaria.cadastrado,
            unicode"Somente uma secretaria pode solicitar um serviço."
        );

        ServicoInfo memory servico;

        servico.id = ++_id;
        servico.descricaoResumida = descricaoResumida;
        servico.descricao = descricao;
        servico.valor = valor;
        servico.disponivel = true;
        servico.status = StatusServicoEnum.Disponivel;
        servico.solicitante = msg.sender;
        servico.executor = address(0);
        servico.data = block.timestamp * 1000;
        servico.secretaria = secretaria;
        servico.nomeToken = _govToken.name();
        servico.simboloToken = _govToken.symbol();

        _listaServicos.push(servico);

        _govToken.transferFrom(
            secretaria.enderecoCarteira,
            address(this),
            valor
        );

        _agenteFederado.incluirLinhaExtrato(
            secretaria.enderecoCarteira,
            ExtratoInfo(
                servico.data,
                string.concat(
                    unicode"Reserva de Serviço - ",
                    servico.descricaoResumida
                ),
                valor,
                "D",
                address(this),
                secretaria.enderecoCarteira,
                _govToken.symbol()
            )
        );

        emit servicoAdicionado(servico);
    }

    function executarServico(uint256 id) public onlySupplier {
        uint256 indice = obterIndiceServico(id);

        require(
            _listaServicos[indice].status == StatusServicoEnum.Disponivel,
            unicode"Este serviço não está mais disponível para execução."
        );

        FornecedorInfo memory fornecedor = _fornecedor.obterFornecedor(
            msg.sender
        );

        require(
            fornecedor.aprovado,
            unicode"Apenas Fornecedores com cadastro aprovado podem executar um serviço."
        );

        _listaServicos[indice].fornecedor = fornecedor;
        _listaServicos[indice].executor = msg.sender;
        _listaServicos[indice].disponivel = false;
        _listaServicos[indice].status = StatusServicoEnum.EmExecucao;
    }

    function concluirSolicitarPagamentoServico(uint256 id) public onlySupplier {
        uint256 indice = obterIndiceServico(id);

        require(
            _listaServicos[indice].status == StatusServicoEnum.EmExecucao,
            unicode"Este serviço não está em execução e seu pagamento não pode ser solicitado."
        );

        FornecedorInfo memory fornecedor = _fornecedor.obterFornecedor(
            msg.sender
        );

        require(
            fornecedor.enderecoCarteira ==
                _listaServicos[indice].fornecedor.enderecoCarteira,
            unicode"A Conclusão do Serviço e a Solicitação de Pagamento só podem ser realizada pelo executor do serviço."
        );

        _listaServicos[indice].status = StatusServicoEnum.AguardandoPagamento;
    }

    function liberarPagamentoServico(uint256 id) public onlySecretary {
        uint256 indice = obterIndiceServico(id);

        require(
            _listaServicos[indice].status ==
                StatusServicoEnum.AguardandoPagamento,
            unicode"Este serviço não está aguardando pagamento."
        );

        SecretariaInfo memory secretaria = _agenteFederado.obterSecretaria(
            msg.sender
        );

        require(
            secretaria.enderecoCarteira == _listaServicos[indice].solicitante,
            unicode"Somente o solicitante do serviço pode liberar o pagamento."
        );

        _listaServicos[indice].status = StatusServicoEnum.Finalizado;

        _govToken.approve(address(_contaLastro), _listaServicos[indice].valor);

        _contaLastro.solicitarRepasse(
            _listaServicos[indice].executor,
            _listaServicos[indice].id,
            _listaServicos[indice].valor
        );
    }

    function obterIndiceServico(uint256 id) private pure returns (uint256) {
        uint256 indice = id - 1;
        return indice;
    }

    function obterServico(uint256 id) public view returns (ServicoInfo memory) {
        return _listaServicos[obterIndiceServico(id)];
    }
}
