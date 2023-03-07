// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TiposComuns.sol";
import "./AgenteFederado.sol";
import "./Fornecedor.sol";

struct Servico {
    uint256 id;
    uint256 data;
    string descricaoResumida;
    string descricao;
    uint256 valor;
    TipoSecretaria tipo;
    address solicitante;
    address executor;

    string uf;
    //string agenteFederado;
    string secretaria;
    string nomeToken;
    string simboloToken;

    bool disponivel;

    AgenteFederadoInfo agenteFederado;
    FornecedorInfo fornecedor;
}

contract PainelServico {
    //Propriedades
    uint256 private _qtdServicos = 0;
    Servico[] private _listaServicos;
    uint256 private _id = 0;
    AgenteFederado private _agenteFederado;
    Fornecedor private _fornecedor;

    //Construtores
    constructor(AgenteFederado agenteFederado, Fornecedor fornecedor) {
        _agenteFederado = agenteFederado;
        _fornecedor = fornecedor;
    }

    //Modificadores
    modifier onlyOwner() {
        //require(_owners[msg.sender] == true);
        _;
    }

    //Eventos
    event servicoAdicionado(Servico servico);

    //Funções
    function setOwner(address owner, bool isOwner) public onlyOwner {
        //_owners[owner] = isOwner;
    }

    function listarServicos() public view returns (Servico[] memory) {
        return _listaServicos;
    } 

    function adicionarServico(
        string memory descricaoResumida,
        string memory descricao,
        uint256 valor,
        string memory tipo
        ) public {
        Servico memory servico;

        servico.id = ++_id;
        servico.descricaoResumida = descricaoResumida;
        servico.descricao = descricao;
        servico.valor = valor;
        servico.disponivel = true;

        if(keccak256(abi.encodePacked(tipo)) == keccak256(abi.encodePacked("GvS"))){
            servico.tipo = TipoSecretaria.Saude;
            servico.secretaria = unicode"Saúde";
            
            servico.nomeToken = "GovSaudeToken";
            servico.simboloToken = "GvS";
        }
        else if(keccak256(abi.encodePacked(tipo)) == keccak256(abi.encodePacked("GvE"))){
            servico.tipo = TipoSecretaria.Educacao;
            servico.secretaria = unicode"Educação";
            
            servico.nomeToken = "GovEducacaoToken";
            servico.simboloToken = "GvE";
        }
        
        adicionarServico(servico);
    }

    function executarServico(uint256 id) public {
        for (uint i = 0; i < _qtdServicos; i++) {
            if(_listaServicos[i].id == id){
                require(_fornecedor.obterFornecedor(msg.sender).cadastrado, 
                unicode"Esta Conta não pode executar um serviço");

                _listaServicos[i].executor = msg.sender;
                _listaServicos[i].fornecedor = _fornecedor.obterFornecedor(msg.sender);
                _listaServicos[i].disponivel = false;

                break;
            }
        }
    }

    function adicionarServico(Servico memory servico) private {
        servico.solicitante = msg.sender;
        servico.executor = address(0);
        servico.data = block.timestamp*1000;
        
        require(_agenteFederado.obterAgenteFederado(msg.sender).cadastrado, 
                unicode"Esta Conta não pode solicitar um serviço");

        servico.agenteFederado = _agenteFederado.obterAgenteFederado(msg.sender);

        _listaServicos.push(servico);
        _qtdServicos = _listaServicos.length;

        emit servicoAdicionado(servico);
    }
}
