// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GovEducacaoToken.sol";
import "./GovSaudeToken.sol";

contract ContaLastro {
    mapping(address => bool) private _owner;
    GovEducacaoToken private _educToken;
    GovSaudeToken private _saudeToken;

    uint256 public extratoSaudeCount = 0;
    Extrato[] public _extratoSaude;

    uint256 public extratoEducacaoCount = 0;
    Extrato[] public _extratoEducacao;

    struct Extrato {
        uint256 data;
        string descricao;
        uint256 valor;
        string creditoDebito;
        address origem;
    }

    constructor(GovEducacaoToken educToken, GovSaudeToken saudeToken) {
        _owner[msg.sender] = true;
        _educToken = educToken;
        _saudeToken = saudeToken;
    }

    modifier onlyOwner() {
        require(_owner[msg.sender] == true);
        _;
    }

    function setOwner(address owner, bool isOwner) public onlyOwner {
        _owner[owner] = isOwner;
    }

    event depositoSaudeRealizado(address sender, uint256 data, uint256 valor);
    event depositoEducacaoRealizado(
        address sender,
        uint256 data,
        uint256 valor
    );

    function realizarDepositoSaude(uint256 data, uint256 valor)
        public
        onlyOwner
    {
        _extratoSaude.push(
            Extrato(data, unicode"Depósito", valor, "C", address(0))
        );
        extratoSaudeCount = _extratoSaude.length;

        _saudeToken.mint(address(this), valor);

        emit depositoSaudeRealizado(msg.sender, data, valor);
    }

    function realizarDepositoEducacao(uint256 data, uint256 valor)
        public
        onlyOwner
    {
        _extratoEducacao.push(
            Extrato(data, unicode"Depósito", valor, "C", address(0))
        );
        extratoEducacaoCount = _extratoEducacao.length;

        _educToken.mint(address(this), valor);

        emit depositoEducacaoRealizado(msg.sender, data, valor);
    }
}
