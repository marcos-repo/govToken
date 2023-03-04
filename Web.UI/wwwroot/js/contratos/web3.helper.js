(async function carregarWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
    }
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    carregarCarteiraUsuario();

    bindEventoContaAlterada(() => {
        carregarCarteiraUsuario();
    })
})();

async function carregarCarteiraUsuario() {
    var carteira = await obterContaWeb3();

    if (carteira == null || carteira == '')
        carteira = "(desconhecido)";

    $("#spCarteiraUsuario").text(carteira);
}

async function obterContaWeb3() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

    return accounts[0];
}

async function obterIdRede() {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    return networkId;
}

async function obterContrato(jsonPath) {
    var objJson = await lerJson(jsonPath);

    const idRede = await obterIdRede();

    const networkData = await objJson.networks[idRede];

    if (!networkData) {
        return null;
    }

    return new web3.eth.Contract(objJson.abi, networkData.address);
}

async function obterRede() {
    var netName = 'desconhecida';
    const netId = window.ethereum.networkVersion;

    switch (netId) {
        case '1':
            netName = "Mainnet";
            break;
        case '5':
            netName = "Goerli";
            break;
        case '2020':
            netName = "Ganache";
            break;
    }

    return netName;
}

function bindEventoContaAlterada(func) {
    window.ethereum.on('accountsChanged', func);
}

function bindEventoRedeAlterada(func) {
    window.ethereum.on('chainChanged', func);
}

async function lerJson(jsonPath) {
    var objJson;

    await fetch(jsonPath)
        .then((response) => response.json())
        .then((json) => objJson = json);

    return objJson;
}

function fromBlockChainDate(data) {
    return new Date(parseInt(data));
}

function toBlockChainDate(data) {
    return data.getTime();
}

function toBlockChainDecimal(valor) {
    return parseInt(valor * 100);
}

function fromBlockChainDecimal(valor) {
    return valor / 100.0;
}