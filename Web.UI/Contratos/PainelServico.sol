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
    uint256 private _qtdServicos = 0;
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

    modifier onlyFederated() {
        require(
            _agenteFederado.obterAgenteFederado(msg.sender).cadastrado,
            unicode"Operação permitida apenas para Agentes Federados."
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
        bool isAgenteFederado = _agenteFederado
            .obterAgenteFederado(msg.sender)
            .cadastrado;
        bool isFornecedor = _fornecedor.obterFornecedor(msg.sender).cadastrado;

        uint256 qtdeServicosFiltrados = 0;
        for (uint256 i = 0; i < _qtdServicos; i++) {
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
        for (uint256 i = 0; i < _qtdServicos; i++) {
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
        uint256 valor,
        string memory tipo
    ) public {
        ServicoInfo memory servico;

        servico.id = ++_id;
        servico.descricaoResumida = descricaoResumida;
        servico.descricao = descricao;
        servico.valor = valor;
        servico.disponivel = true;
        servico.status = StatusServicoEnum.Disponivel;

        if (_string.compare(tipo, "GvS")) {
            servico.tipo = TipoSecretariaEnum.Saude;
            servico.secretaria = unicode"Saúde";

            servico.nomeToken = "GovSaudeToken";
            servico.simboloToken = "GvS";
        } else if (_string.compare(tipo, "GvE")) {
            servico.tipo = TipoSecretariaEnum.Educacao;
            servico.secretaria = unicode"Educação";

            servico.nomeToken = "GovEducacaoToken";
            servico.simboloToken = "GvE";
        }

        adicionarServico(servico);
    }

    function adicionarServico(ServicoInfo memory servico) private {
        servico.solicitante = msg.sender;
        servico.executor = address(0);
        servico.data = block.timestamp * 1000;

        require(
            _agenteFederado.obterAgenteFederado(msg.sender).cadastrado,
            unicode"Esta Conta não pode solicitar um serviço"
        );

        servico.agenteFederado = _agenteFederado.obterAgenteFederado(
            msg.sender
        );

        _listaServicos.push(servico);
        _qtdServicos = _listaServicos.length;

        emit servicoAdicionado(servico);
    }

    function executarServico(uint256 id) public onlySupplier {
        for (uint256 i = 0; i < _qtdServicos; i++) {
            if (_listaServicos[i].id == id) {
                require(
                    _listaServicos[i].status == StatusServicoEnum.Disponivel,
                    unicode"Este serviço não está mais disponível para execução."
                );

                FornecedorInfo memory fornecedor = _fornecedor.obterFornecedor(
                    msg.sender
                );

                require(
                    _string.compare(
                        _listaServicos[i].simboloToken,
                        fornecedor.secretaria
                    ),
                    unicode"Esta operação não pode ser executada pelo owner desta carteira."
                );

                _listaServicos[i].fornecedor = fornecedor;

                _listaServicos[i].executor = msg.sender;
                _listaServicos[i].disponivel = false;
                _listaServicos[i].status = StatusServicoEnum.EmExecucao;

                break;
            }
        }
    }

    function concluirSolicitarPagamentoServico(uint256 id) public onlySupplier {
        for (uint256 i = 0; i < _qtdServicos; i++) {
            if (_listaServicos[i].id == id) {
                require(
                    _listaServicos[i].status == StatusServicoEnum.EmExecucao,
                    unicode"Este serviço não está em execução e seu pagamento não pode ser solicitado."
                );

                FornecedorInfo memory fornecedor = _fornecedor.obterFornecedor(
                    msg.sender
                );

                require(
                    fornecedor.enderecoCarteira ==
                        _listaServicos[i].fornecedor.enderecoCarteira,
                    unicode"A Conclusão do Serviço e a Solicitação de Pagamento só podem ser realizada pelo executor do serviço."
                );

                require(
                    _string.compare(
                        _listaServicos[i].simboloToken,
                        fornecedor.secretaria
                    ),
                    unicode"Esta operação não pode ser executada pelo owner desta carteira."
                );

                _listaServicos[i].status = StatusServicoEnum
                    .AguardandoPagamento;

                break;
            }
        }
    }

    function liberarPagamentoServico(uint256 id) public onlyFederated {
        for (uint256 i = 0; i < _qtdServicos; i++) {
            if (_listaServicos[i].id == id) {
                require(
                    _listaServicos[i].status ==
                        StatusServicoEnum.AguardandoPagamento,
                    unicode"Este serviço não está aguardando pagamento."
                );

                AgenteFederadoInfo memory agenteFederado = _agenteFederado
                    .obterAgenteFederado(msg.sender);

                require(
                    agenteFederado.enderecoCarteira ==
                        _listaServicos[i].agenteFederado.enderecoCarteira,
                    unicode"Somente o solicitante do serviço pode liberar o pagamento."
                );

                _listaServicos[i].status = StatusServicoEnum.Finalizado;

                _govToken.approve(
                    address(_contaLastro),
                    _listaServicos[i].valor
                );

                _contaLastro.solicitarRepasse(
                    _listaServicos[i].executor,
                    _listaServicos[i].data,
                    _listaServicos[i].id,
                    _listaServicos[i].valor
                );

                break;
            }
        }
    }
}
