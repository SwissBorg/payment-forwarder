# payment-forwarder
a contract which creates payment forwarding functionality

The system is built around a factory contract which creates the actual forwarders.

The sole purpose of the forwarders is to send the ETH that is transferred to them to another address

Each time some ETH is forwarded, an event is triggered on the factory contract. This allows to listen to only one event 
instead of monitoring all the forwarders.

## setup

in order to work with this repo you have to have truffle installed

`npm -g i truffle`

and testrpc

`npm -g i ganache-cli`

### running tests

`truffle test` 