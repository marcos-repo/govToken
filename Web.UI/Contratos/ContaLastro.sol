// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GovToken.sol";
import "./AgenteFederado.sol";
import "./PainelServico.sol";
import "./TiposComuns.sol";

contract ContaLastro {
    //Propriedades
    mapping(address => bool) private _owners;

    GovToken private _govToken;
    AgenteFederado private _agenteFederado;
    PainelServico private _painelServico;
    Fornecedor private _fornecedor;

    ExtratoInfo[] private _extrato;
    uint256 private _saldo;

    //Construtores
    constructor(
        GovToken govToken,
        AgenteFederado agenteFederado,
        PainelServico painelServico,
        Fornecedor fornecedor
    ) {
        _owners[msg.sender] = true;
        _govToken = govToken;
        _agenteFederado = agenteFederado;
        _painelServico = painelServico;
        _fornecedor = fornecedor;
        _saldo = 0;
    }

    //Modificadores
    modifier onlyOwner() {
        require(
            _owners[msg.sender],
            unicode"Somente os resposáveis pelo contrato da Conta Lastro podem realizar essa operação."
        );
        _;
    }

    modifier onlyServicePanel() {
        require(
            msg.sender == address(_painelServico),
            unicode"Somente o contrato do painel de serviço pode realizar essa operação."
        );
        _;
    }

    //Eventos
    event depositoRealizado(address sender, uint256 data, uint256 valor);
    event transferenciaRealizada(
        address sender,
        address enderecoAgenteFederado,
        uint256 data,
        uint256 valor
    );
    event solicitacaoRepasseRealizada(
        address fornecedor,
        uint256 data,
        uint256 valor,
        uint256 idServico
    );

    //Funções
    function setOwner(address owner, bool isOwner) public onlyOwner {
        _owners[owner] = isOwner;
    }

    function consultarExtrato() public view returns (ExtratoInfo[] memory) {
        return _extrato;
    }

    function consultarSaldo() public view returns (uint256) {
        return _saldo;
    }

    function realizarDeposito(uint256 valor) public onlyOwner {
        uint256 data = block.timestamp * 1000;

        _govToken.mint(address(this), valor);

        _extrato.push(
            ExtratoInfo(
                data,
                unicode"Depósito na Conta Lastro",
                valor,
                "C",
                address(0),
                address(this),
                "R$"
            )
        );

        _extrato.push(
            ExtratoInfo(
                data,
                unicode"Depósito na Conta Lastro - Mint Token",
                valor,
                "C",
                address(0),
                address(this),
                _govToken.symbol()
            )
        );

        _saldo += valor;

        emit depositoRealizado(msg.sender, data, valor);
    }

    function transferirToken(
        address enderecoSecretaria,
        uint256 valor
    ) public onlyOwner {
        SecretariaInfo memory secretaria = _agenteFederado.obterSecretaria(
            enderecoSecretaria
        );

        require(
            secretaria.cadastrado,
            unicode"O endereço informado deve ser o de uma secretaria."
        );

        AgenteFederadoInfo memory agenteFederado = _agenteFederado
            .obterAgenteFederado(secretaria.enderecoAgenteFederado);

        uint256 data = block.timestamp * 1000;

        _govToken.approve(address(this), valor);
        _govToken.transfer(enderecoSecretaria, valor);

        string memory descricaoExtrato = unicode"Transferência - ";
        descricaoExtrato = string.concat(
            descricaoExtrato,
            agenteFederado.descricao
        );
        descricaoExtrato = string.concat(descricaoExtrato, " - ");
        descricaoExtrato = string.concat(
            descricaoExtrato,
            secretaria.descricao
        );

        _extrato.push(
            ExtratoInfo(
                data,
                descricaoExtrato,
                valor,
                "D",
                address(this),
                enderecoSecretaria,
                _govToken.symbol()
            )
        );

        _agenteFederado.incluirLinhaExtrato(
            enderecoSecretaria,
            ExtratoInfo(
                data,
                unicode"Recebimento de Verba - Conta Lastro da União",
                valor,
                "C",
                address(this),
                enderecoSecretaria,
                _govToken.symbol()
            )
        );

        emit transferenciaRealizada(
            msg.sender,
            enderecoSecretaria,
            data,
            valor
        );
    }

    function solicitarRepasse(
        address enderecoFornecedor,
        uint256 idServico,
        uint256 valor
    ) public onlyServicePanel {
        uint256 data = block.timestamp * 1000;

        _govToken.transferFrom(address(_painelServico), address(this), valor);

        _govToken.approve(address(this), valor);
        _govToken.burnFrom(address(this), valor);

        ServicoInfo memory servico = _painelServico.obterServico(idServico);
        FornecedorInfo memory fornecedor = _fornecedor.obterFornecedor(
            servico.executor
        );

        string
            memory descricaoExtrato = unicode"Solicitação de Repasse de Serviço | Serviço: ";
        descricaoExtrato = string.concat(
            descricaoExtrato,
            servico.descricaoResumida
        );
        descricaoExtrato = string.concat(descricaoExtrato, " | Executor: ");
        descricaoExtrato = string.concat(descricaoExtrato, fornecedor.nome);

        _extrato.push(
            ExtratoInfo(
                data,
                descricaoExtrato,
                valor,
                "C",
                address(_painelServico),
                address(this),
                _govToken.symbol()
            )
        );

        string
            memory descricaoExtrato2 = unicode"Queima de Token para Realização de Repasse | Serviço: ";
        descricaoExtrato2 = string.concat(
            descricaoExtrato2,
            servico.descricaoResumida
        );
        descricaoExtrato2 = string.concat(descricaoExtrato2, " | Executor: ");
        descricaoExtrato2 = string.concat(descricaoExtrato2, fornecedor.nome);

        _extrato.push(
            ExtratoInfo(
                data,
                descricaoExtrato2,
                valor,
                "D",
                address(this),
                address(0),
                _govToken.symbol()
            )
        );

        string memory descricaoExtrato3 = unicode"Repasse | Serviço: ";
        descricaoExtrato3 = string.concat(
            descricaoExtrato3,
            servico.descricaoResumida
        );
        descricaoExtrato3 = string.concat(descricaoExtrato3, " | Executor: ");
        descricaoExtrato3 = string.concat(descricaoExtrato3, fornecedor.nome);

        _extrato.push(
            ExtratoInfo(
                data,
                descricaoExtrato3,
                valor,
                "D",
                address(this),
                enderecoFornecedor,
                "R$"
            )
        );

        _saldo -= valor;

        emit solicitacaoRepasseRealizada(
            enderecoFornecedor,
            data,
            valor,
            idServico
        );
    }
}
