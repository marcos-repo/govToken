// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GovEducacaoToken.sol";
import "./GovSaudeToken.sol";

contract ContaLastro {
    address public _owner;
    GovEducacaoToken private _educToken;
    GovSaudeToken private _saudeToken;
    
    uint public extratoSaudeCount = 0;
    Extrato[] public _extratoSaude;

    uint public extratoEducacaoCount = 0;
    Extrato[] public _extratoEducacao;

    struct Extrato {
        uint data;
        string descricao;
        uint valor;
        string creditoDebito;
        address origem;
    }

    constructor(GovEducacaoToken educToken, GovSaudeToken saudeToken) {
        _owner = msg.sender;
        _educToken = educToken;
        _saudeToken = saudeToken;
    }

    modifier onlyOwner {
        require(msg.sender == _owner);
        _;
    }

    function realizarDepositoSaude(uint data, uint valor) public onlyOwner {     
        _extratoSaude.push(Extrato(data, unicode"Depósito", valor, "C", address(0)));
        _saudeToken.mint(address(this), valor);
        extratoSaudeCount = _extratoSaude.length;
    }

    function realizarDepositoEducacao(uint data, uint valor) public onlyOwner {     
        _extratoEducacao.push(Extrato(data, unicode"Depósito", valor, "C", address(0)));
        _educToken.mint(address(this), valor);
        extratoEducacaoCount = _extratoEducacao.length;
    }
}