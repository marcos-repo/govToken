// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TiposComuns.sol";

contract AgenteFederado {
    //Propriedades
    uint256 private _qtdAgentesFederados;
    address[] private _enderecosAgentesFederados;
    mapping(address => AgenteFederadoInfo) private _agentesFederados;

    mapping(address => bool) private _owners;
    mapping(address => Extrato[]) private _extrato;

    //Construtores
    constructor() {
        _owners[msg.sender] = true;
    }

    //Modificadores
    modifier onlyOwner() {
        require(_owners[msg.sender] == true);
        _;
    }

    //Funções
    function setOwner(address owner, bool isOwner) public onlyOwner {
        _owners[owner] = isOwner;
    }

    function cadastrarAgenteFederado(AgenteFederadoInfo memory agenteFederado)
        public
        onlyOwner
    {
        agenteFederado.cadastrado = true;
        _agentesFederados[agenteFederado.enderecoCarteira] = agenteFederado;
        _enderecosAgentesFederados.push(agenteFederado.enderecoCarteira);
        _qtdAgentesFederados = _enderecosAgentesFederados.length;
    }

    function listarAgentesFederados()
        public
        view
        returns (AgenteFederadoInfo[] memory)
    {
        AgenteFederadoInfo[] memory agentesFederados = new AgenteFederadoInfo[](
            _qtdAgentesFederados
        );

        for (uint256 i = 0; i < _qtdAgentesFederados; i++) {
            address endereco = _enderecosAgentesFederados[i];
            agentesFederados[i] = _agentesFederados[endereco];
        }

        return agentesFederados;
    }

    function obterAgenteFederado(address endereco)
        public
        view
        returns (AgenteFederadoInfo memory)
    {
        return _agentesFederados[endereco];
    }

    function incluirLinhaExtrato(address endereco, Extrato memory extrato)
        public
        onlyOwner
    {
        require(_agentesFederados[endereco].cadastrado);
        _extrato[endereco].push(extrato);
    }

    function consultarExtrato(address endereco)
        public
        view
        returns (Extrato[] memory)
    {
        return _extrato[endereco];
    }
}
