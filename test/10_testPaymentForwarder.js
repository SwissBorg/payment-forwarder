// Copyright (c) 2017 Sweetbridge Stiftung (Sweetbridge Foundation)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let utils = require('./utils')
var Roles = artifacts.require('Roles')
var ForwarderFactory = artifacts.require('ForwarderFactory')
var PaymentForwarder = artifacts.require('PaymentForwarder')

contract('Forwarder', function (accounts) {
  let fwdFactory
  let fwd

  before(async () => {
    fwdFactory = await ForwarderFactory.deployed()
  })

  it('can create a forwarder', async () => {
    let tx = await fwdFactory.createForwarder(accounts[1])
    let param = utils.getParamFromTxEvent(tx, 'forwarder', null, 'LogForwarderCreated')
    fwd = await PaymentForwarder.at(param)
    assert.equal(await fwd.destination(), accounts[1])
    assert.equal(await fwd.factory(), ForwarderFactory.address)
    return 1
  })

  it('forwards payments to the correct destination', async () => {
    let balance = web3.eth.getBalance(accounts[1])
    let watcher = fwdFactory.LogPaymentForwarded({fromBlock: "latest"})

    await Promise.all([
      web3.eth.sendTransaction({from: accounts[0], to: fwd.address, value: 1e18, gas: 50000}),
      new Promise((resolve, reject) => {
        watcher.watch(function(error, result) {
          // This will catch all Transfer events, regardless of how they originated.
          assert.notOk(error)
          assert.equal(accounts[0], result.args.from)
          assert.equal(fwd.address, result.args.destination)
          assert.equal(1e18, result.args.amount.toNumber())
          watcher.stopWatching()
          resolve(true)
        })
        setTimeout(() => {
          watcher.stopWatching()
          reject(new Error('timeout'))
        }, 2000)
      })
    ])
    assert.equal(balance.add(1e18).toString(), web3.eth.getBalance(accounts[1]).toString())
  })

})
