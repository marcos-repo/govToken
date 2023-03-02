## Subir o container e acessá-lo:
```
$ docker-compose up -d
$ docker exec -it gov-token /bin/bash
```

## Instalar pacotes acessórios
```
$ apk update && apk upgrade
$ apk add --update git
$ apk add --update npm
$ npm install
$ npm install -g truffle@5.5.22
$ npm install -g ganache-cli@6.12.2
```


## Executar o Ganache
```
$ ganache-cli -h 0.0.0.0 --port 7545 --networkId 2020 --chainId 1234 --deterministic --db /govtoken/db/ganache
```

### Usar o truffle para publicar os contratos no Ganache
```
$ truffle migrate --network govtoken --reset
$ truffle migrate --network goerli --reset
```

### Para deploy na goerli, criar o arquivo .env
```
INFURA_APIKEY={API KEY DO INFURA}
MNEMONIC={Mnemonic da sua carteira}
ADDRESS={Endereço da sua carteira}

```