// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct ExtratoInfo {
    uint256 data;
    string descricao;
    uint256 valor;
    string creditoDebito;
    address origem;
    address destino;
    string simboloToken;
}

struct AgenteFederadoInfo {
    uint256 dataCadastro;
    string uf;
    string descricao;
    address enderecoCarteira;
    bool cadastrado;
}

struct SecretariaInfo {
    uint256 dataCadastro;
    address enderecoAgenteFederado;
    string descricao;
    address enderecoCarteira;
    bool cadastrado;
}

struct FornecedorInfo {
    uint256 dataCadastro;
    string uf;
    string nome;
    address enderecoCarteira;
    bool cadastrado;
    bool aprovado;
    uint256 dataAprovacao;
}

struct ServicoInfo {
    uint256 id;
    uint256 data;
    string descricaoResumida;
    string descricao;
    uint256 valor;
    address solicitante;
    address executor;
    string uf;
    string nomeToken;
    string simboloToken;
    bool disponivel;
    StatusServicoEnum status;
    SecretariaInfo secretaria;
    FornecedorInfo fornecedor;
    bool visaoFornecedor;
    bool visaoAgenteFederado;
}

enum StatusServicoEnum {
    Disponivel, //0 - Liberado para Execução
    EmExecucao, //1 - Em Execução
    AguardandoPagamento, //2 - Aguardando Pagamento
    Finalizado //3 - Finalizado
}
