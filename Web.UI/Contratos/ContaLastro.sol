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

    ExtratoInfo[] private _extrato;

    //Construtores
    constructor(
        GovToken govToken,
        AgenteFederado agenteFederado,
        PainelServico painelServico
    ) {
        _owners[msg.sender] = true;
        _govToken = govToken;
        _agenteFederado = agenteFederado;
        _painelServico = painelServico;
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

    function realizarDeposito(uint256 data, uint256 valor) public onlyOwner {
        _govToken.mint(address(this), valor);

        _extrato.push(
            ExtratoInfo(
                data,
                unicode"Depósito",
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
                unicode"Mint Token",
                valor,
                "C",
                address(0),
                address(this),
                _govToken.symbol()
            )
        );

        emit depositoRealizado(msg.sender, data, valor);
    }

    function transferirToken(
        address enderecoSecretaria,
        uint256 data,
        uint256 valor
    ) public onlyOwner {
        require(
            _agenteFederado.obterSecretaria(enderecoSecretaria).cadastrado,
            unicode"O endereço informado deve ser o de uma secretaria."
        );

        _govToken.approve(address(this), valor);
        _govToken.transfer(enderecoSecretaria, valor);

        _extrato.push(
            ExtratoInfo(
                data,
                unicode"Transferência",
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
                unicode"Depósito",
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
        uint256 data,
        uint256 valor
    ) public onlyServicePanel {
        _govToken.transferFrom(address(_painelServico), address(this), valor);

        _govToken.approve(address(this), valor);
        _govToken.burnFrom(address(this), valor);

        _extrato.push(
            ExtratoInfo(
                data,
                unicode"Solicitação Repasse",
                valor,
                "C",
                address(_painelServico),
                address(this),
                _govToken.symbol()
            )
        );

        _extrato.push(
            ExtratoInfo(
                data,
                unicode"Queima Token",
                valor,
                "D",
                address(this),
                address(0),
                _govToken.symbol()
            )
        );

        _extrato.push(
            ExtratoInfo(
                data,
                unicode"Repasse",
                valor,
                "D",
                address(this),
                enderecoFornecedor,
                "R$"
            )
        );

        emit solicitacaoRepasseRealizada(
            enderecoFornecedor,
            data,
            valor,
            idServico
        );
    }
}
