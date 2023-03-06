// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GovToken.sol";
import "./GovEducacaoToken.sol";
import "./GovSaudeToken.sol";
import "./AgenteFederado.sol";
import "./TiposComuns.sol";

contract ContaLastro {
    //Propriedades
    mapping(address => bool) private _owners;

    GovToken private _govToken;
    GovEducacaoToken private _educToken;
    GovSaudeToken private _saudeToken;
    AgenteFederado private _agenteFederado;

    uint256 private _qtdLinhasExtrato = 0;
    Extrato[] private _extrato;

    //Construtores
    constructor(
        GovToken govToken,
        GovEducacaoToken educToken,
        GovSaudeToken saudeToken,
        AgenteFederado agenteFederado
    ) {
        _owners[msg.sender] = true;
        _govToken = govToken;
        _educToken = educToken;
        _saudeToken = saudeToken;
        _agenteFederado = agenteFederado;
    }

    //Modificadores
    modifier onlyOwner() {
        require(_owners[msg.sender]);
        _;
    }

    modifier verificarAgenteFederado(address endereco) {
        require(_agenteFederado.obterAgenteFederado(endereco).cadastrado);
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

    //Funções
    function setOwner(address owner, bool isOwner) public onlyOwner {
        _owners[owner] = isOwner;
    }

    function consultarExtrato() public view returns (Extrato[] memory) {
        return _extrato;
    }

    function realizarDeposito(uint256 data, uint256 valor) public onlyOwner {
        _govToken.mint(address(this), valor);

        _extrato.push(
            Extrato(
                data,
                unicode"Depósito",
                valor,
                "C",
                address(0),
                address(this),
                "R$"
            )
        );
        _qtdLinhasExtrato = _extrato.length;

        emit depositoRealizado(msg.sender, data, valor);
    }

    function transferirToken(
        address enderecoAgenteFederado,
        uint256 data,
        uint256 valor,
        TipoSecretaria tipoSecretaria
    ) public onlyOwner {
        string memory simboloToken;

        _govToken.approve(address(this), valor);
        _govToken.burnFrom(address(this), valor);

        if (tipoSecretaria == TipoSecretaria.Saude) {
            _saudeToken.mint(address(this), valor);

            _saudeToken.approve(enderecoAgenteFederado, valor);
            _saudeToken.transfer(enderecoAgenteFederado, valor);
            simboloToken = _saudeToken.symbol();
        } else if (tipoSecretaria == TipoSecretaria.Educacao) {
            _educToken.mint(address(this), valor);

            _educToken.approve(enderecoAgenteFederado, valor);
            _educToken.transfer(enderecoAgenteFederado, valor);
            simboloToken = _educToken.symbol();
        }

        _extrato.push(
            Extrato(
                data,
                unicode"Transferência",
                valor,
                "D",
                address(this),
                enderecoAgenteFederado,
                _govToken.symbol()
            )
        );
        _qtdLinhasExtrato = _extrato.length;

        _agenteFederado.incluirLinhaExtrato(
            enderecoAgenteFederado,
            Extrato(
                data,
                unicode"Depósito",
                valor,
                "C",
                address(this),
                enderecoAgenteFederado,
                simboloToken
            )
        );

        emit transferenciaRealizada(
            msg.sender,
            enderecoAgenteFederado,
            data,
            valor
        );
    }
}
