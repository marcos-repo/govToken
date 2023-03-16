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
    address agenteFederado;
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

struct ServicoInfo {
    uint256 id;
    uint256 data;
    string descricaoResumida;
    string descricao;
    uint256 valor;
    TipoSecretariaEnum tipo;
    address solicitante;
    address executor;
    string uf;
    string secretaria;
    string nomeToken;
    string simboloToken;
    bool disponivel;
    StatusServicoEnum status;
    AgenteFederadoInfo agenteFederado;
    FornecedorInfo fornecedor;
    bool visaoFornecedor;
    bool visaoAgenteFederado;
}

enum TipoSecretariaEnum {
    Saude,
    Educacao
}

enum StatusServicoEnum {
    Disponivel, //0 - Liberado para Execução
    EmExecucao, //1 - Em Execução
    AguardandoPagamento, //2 - Aguardando Pagamento
    Finalizado //3 - Finalizado
}
