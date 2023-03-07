// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Extrato {
    uint256 data;
    string descricao;
    uint256 valor;
    string creditoDebito;
    address origem;
    address destino;
    string simboloToken;
}

enum TipoSecretaria {
    Saude,
    Educacao
}

struct AgenteFederadoInfo {
    uint256 dataCadastro;
    string uf;
    string descricao;
    address enderecoCarteira;
    bool cadastrado;
}

struct FornecedorInfo {
    uint256 dataCadastro;
    string uf;
    string nome;
    string secretaria;
    address enderecoCarteira;
    bool cadastrado;
}
