// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TiposComuns.sol";

contract AgenteFederado {
    //Propriedades

    uint256 private _qtdAgentesFederados;
    address[] private _enderecosAgentesFederados;
    mapping(address => AgenteFederadoInfo) private _agentesFederados;

    uint256 private _qtdSecretarias;
    address[] private _enderecosSecretarias;
    mapping(address => SecretariaInfo) private _secretarias;
    mapping(address => SecretariaInfo[]) private _secretariasAgenteFederado;

    mapping(address => bool) private _owners;
    mapping(address => ExtratoInfo[]) private _extrato;

    //Construtores
    constructor() {
        _owners[msg.sender] = true;
    }

    //Modificadores
    modifier onlyOwner() {
        require(
            _owners[msg.sender],
            unicode"Somente os resposáveis pelo contrato de Agente Federado podem realizar essa operação."
        );
        _;
    }

    modifier onlyFederated() {
        require(
            _agentesFederados[msg.sender].cadastrado,
            unicode"Somente um agente federado pode realizar essa operação."
        );
        _;
    }

    //Funções
    function setOwner(address owner, bool isOwner) public onlyOwner {
        _owners[owner] = isOwner;
    }

    function cadastrarAgenteFederado(
        AgenteFederadoInfo memory agenteFederado
    ) public onlyOwner {
        agenteFederado.dataCadastro = block.timestamp * 1000;
        agenteFederado.cadastrado = true;
        _agentesFederados[agenteFederado.enderecoCarteira] = agenteFederado;
        _enderecosAgentesFederados.push(agenteFederado.enderecoCarteira);
        _qtdAgentesFederados = _enderecosAgentesFederados.length;
    }

    function cadastrarSecretaria(
        SecretariaInfo memory secretaria
    ) public onlyFederated {
        secretaria.dataCadastro = block.timestamp * 1000;
        secretaria.enderecoAgenteFederado = msg.sender;
        secretaria.cadastrado = true;
        _secretarias[secretaria.enderecoCarteira] = secretaria;
        _enderecosSecretarias.push(secretaria.enderecoCarteira);
        _qtdSecretarias = _enderecosSecretarias.length;

        _secretariasAgenteFederado[msg.sender].push(secretaria);
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

    function listarSecretarias() public view returns (SecretariaInfo[] memory) {
        SecretariaInfo[] memory secretarias = new SecretariaInfo[](
            _qtdSecretarias
        );

        for (uint256 i = 0; i < _qtdSecretarias; i++) {
            address endereco = _enderecosSecretarias[i];
            secretarias[i] = _secretarias[endereco];
        }

        return secretarias;
    }

    function listarSecretariasAgenteFederado(
        address endereco
    ) public view returns (SecretariaInfo[] memory) {
        return _secretariasAgenteFederado[endereco];
    }

    function obterAgenteFederado(
        address endereco
    ) public view returns (AgenteFederadoInfo memory) {
        return _agentesFederados[endereco];
    }

    function obterSecretaria(
        address endereco
    ) public view returns (SecretariaInfo memory) {
        return _secretarias[endereco];
    }

    function incluirLinhaExtrato(
        address endereco,
        ExtratoInfo memory extrato
    ) public onlyOwner {
        require(
            _secretarias[endereco].cadastrado,
            "A carteira do extrato deve ser de uma secretaria."
        );
        _extrato[endereco].push(extrato);
    }

    function consultarExtrato(
        address endereco
    ) public view returns (ExtratoInfo[] memory) {
        return _extrato[endereco];
    }
}
