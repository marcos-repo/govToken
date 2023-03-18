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
        require(
            _owners[msg.sender] == true,
            unicode"Somente os resposáveis pelo contrato do Fornecedor podem realizar essa operação."
        );
        _;
    }

    //Funções
    function setOwner(address owner, bool isOwner) public onlyOwner {
        _owners[owner] = isOwner;
    }

    function cadastrarFornecedor(FornecedorInfo memory fornecedor) public {
        require(
            !_fornecedores[msg.sender].cadastrado,
            unicode"O fornecedor já se encontra cadastrado."
        );

        fornecedor.dataCadastro = block.timestamp * 1000;
        fornecedor.enderecoCarteira = msg.sender;
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

    function obterFornecedor(
        address endereco
    ) public view returns (FornecedorInfo memory) {
        return _fornecedores[endereco];
    }

    function incluirLinhaExtrato(
        address endereco,
        ExtratoInfo memory extrato
    ) public onlyOwner {
        require(
            _fornecedores[endereco].cadastrado,
            "A carteira do extrato deve ser de um fornecedor."
        );
        _extrato[endereco].push(extrato);
    }

    function consultarExtrato(
        address endereco
    ) public view returns (ExtratoInfo[] memory) {
        return _extrato[endereco];
    }

    function obterQuantidadeSemAprovacao() private view returns(uint quantidade) {

        for (uint256 i = 0; i < _qtdFornecedores; i++) {
            address endereco = _enderecosFornecedores[i];
            if(!_fornecedores[endereco].aprovado)
            quantidade++;
        }
    }

    function listarFornecedoresAprovacaoPendente()
        public
        view
        onlyOwner
        returns (FornecedorInfo[] memory)
    {
        
        uint quantidadePendente = obterQuantidadeSemAprovacao();
        
        FornecedorInfo[] memory fornecedores = new FornecedorInfo[](
            quantidadePendente
        );

        for (uint256 i = 0; i < _qtdFornecedores; i++) {
            address endereco = _enderecosFornecedores[i];

            if(!_fornecedores[endereco].aprovado)
                fornecedores[i] = _fornecedores[endereco];
        }

        return fornecedores;
    }

    function aprovarFornecedor(address enderecoCarteira) public onlyOwner{
        require(
            !_fornecedores[msg.sender].aprovado,
            unicode"O cadastro do fornecedor já foi aprovado anteriormente."
        );

        _fornecedores[enderecoCarteira].dataAprovacao = block.timestamp * 1000;
        _fornecedores[enderecoCarteira].aprovado = true;
    }

    
}
