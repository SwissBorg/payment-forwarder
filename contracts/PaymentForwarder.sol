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

pragma solidity ^0.4.17;

import "./authority/Roles.sol";

interface PaymentForwarderEmitterI {
    function emitLogPaymentForwarded(address from, address destination, uint256 amount) public;
}


contract PaymentForwarder {
    PaymentForwarderEmitterI public factory;
    address public destination;

    function PaymentForwarder(address destination_) public {
        destination = destination_;
        factory = PaymentForwarderEmitterI(msg.sender);
    }

    function () payable public {
        destination.transfer(msg.value);
        factory.emitLogPaymentForwarded(msg.sender, address(this), msg.value);
    }
}


contract ForwarderFactoryEvents {
    event LogForwarderCreated(address forwarder);
    event LogPaymentForwarded(address from, address destination, uint256 amount);
}


contract ForwarderFactory is ForwarderFactoryEvents, PaymentForwarderEmitterI, SecuredWithRoles {
    mapping(address => bool) forwarders;

    function ForwarderFactory(address rolesContract) public SecuredWithRoles("ForwarderFactory", rolesContract) {
        // nothing to do, just calling super
    }

    function createForwarder(address destination) public roleOrOwner("admin") {
        PaymentForwarder forwarder = new PaymentForwarder(destination);
        forwarders[forwarder] = true;
        LogForwarderCreated(address(forwarder));
    }

    function emitLogPaymentForwarded(address from, address destination, uint256 amount) public {
        require(forwarders[msg.sender]);
        LogPaymentForwarded(from, destination, amount);
    }
}
