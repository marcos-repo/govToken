// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Servico {
    uint256 id;
    uint256 data;
    string descricaoResumida;
    string descricao;
    uint256 valor;
    TipoServico tipo;
    
    address solicitante;
    address executor;

    bool disponivel;
}

enum TipoServico {
    Saude,
    Educacao
}

contract PainelServico {
    //Propriedades
    uint256 private _qtdServicos = 0;
    Servico[] private _listaServicos;
    uint256 private _id = 0;

    //Construtores
    constructor() {
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

        if(keccak256(abi.encodePacked(tipo)) == keccak256(abi.encodePacked("GvS")))
            servico.tipo = TipoServico.Saude;
        else if(keccak256(abi.encodePacked(tipo)) == keccak256(abi.encodePacked("GvE")))
            servico.tipo = TipoServico.Educacao;

        adicionarServico(servico);
    }

    function executarServico(uint256 id) public {
        for (uint i = 0; i < _qtdServicos; i++) {
            if(_listaServicos[i].id == id){
                _listaServicos[i].executor = msg.sender;
                _listaServicos[i].disponivel = false;
                break;
            }
        }
    }

    function adicionarServico(Servico memory servico) private {
        servico.solicitante = msg.sender;
        servico.executor = address(0);
        servico.data = block.timestamp*1000;
        
        _listaServicos.push(servico);
        _qtdServicos = _listaServicos.length;

        emit servicoAdicionado(servico);
    }
}
