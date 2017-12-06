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

var ForwarderFactory = artifacts.require('ForwarderFactory')
var Roles = artifacts.require('Roles')

module.exports = function (deployer) {
  let ctrctHash = undefined
  let fwdFactory = undefined
  let roles = Roles.at(Roles.address)
  return deployer.deploy(ForwarderFactory, Roles.address)
    .then(ctrct => {
      fwdFactory = ForwarderFactory.at(ForwarderFactory.address)
      return fwdFactory.contractHash()
    })
    .then(hash => {
      ctrctHash = hash
      return roles.addContractRole(ctrctHash, 'admin')
    })
    .then(() => {
      return roles.grantUserRole(ctrctHash, 'admin', web3.eth.accounts[5])
    })
}
