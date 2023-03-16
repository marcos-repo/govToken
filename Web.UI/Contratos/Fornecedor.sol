// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TiposComuns.sol";

contract Fornecedor {
    //Propriedades
    uint256 private _qtdFornecedores;
    address[] private _enderecosFornecedores;
    mapping(address => FornecedorInfo) private _fornecedores;

    mapping(address => bool) private _owners;
    mapping(address => ExtratoInfo[]) private _extrato;

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

    function cadastrarFornecedor(FornecedorInfo memory fornecedor)
        public
        onlyOwner
    {
        fornecedor.cadastrado = true;
        _fornecedores[fornecedor.enderecoCarteira] = fornecedor;
        _enderecosFornecedores.push(fornecedor.enderecoCarteira);
        _qtdFornecedores = _enderecosFornecedores.length;
    }

    function listarFornecedores()
        public
        view
        returns (FornecedorInfo[] memory)
    {
        FornecedorInfo[] memory fornecedores = new FornecedorInfo[](
            _qtdFornecedores
        );

        for (uint256 i = 0; i < _qtdFornecedores; i++) {
            address endereco = _enderecosFornecedores[i];
            fornecedores[i] = _fornecedores[endereco];
        }

        return fornecedores;
    }

    function obterFornecedor(address endereco)
        public
        view
        returns (FornecedorInfo memory)
    {
        return _fornecedores[endereco];
    }

    function incluirLinhaExtrato(address endereco, ExtratoInfo memory extrato)
        public
        onlyOwner
    {
        require(_fornecedores[endereco].cadastrado);
        _extrato[endereco].push(extrato);
    }

    function consultarExtrato(address endereco)
        public
        view
        returns (ExtratoInfo[] memory)
    {
        return _extrato[endereco];
    }
}
