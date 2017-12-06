# Roles in the SweetBridge contracts

Every function in the SB Contracts can be constrained with a role by
inheriting the `SecuredWithRoles` constract.

## Modifiers

in order to restrict access to a function there are 3 modifiers

* onlyOwner - only the owner can execute a function
* onlyRole - only authorize members of a particular role to execute a function
* roleOrOwner - both the owner of the contract and members of a role have access

### Examples

these examples illustrate the usage of each modifier.

#### OnlyOwner

* `Root.setBRG` shall only be executed by the contract owner as this has a big impact on all the contracts.
Similarly any function that has a global impact is restricted in this way.
* `Assets.transferEth` shall only be executed by the owner as the ETH belong to them alone.

#### OnlyRole

* `Vault.acceptUouRequest` is restricted to the `uouOracle` role as the function exists precisely to avoid that the owner
create unauthorised UOUs

#### RoleOrOwner

all other functions are either unrestricted or executable by a role or the owner.

## Roles


### Roles per contract

The defined roles in the contracts are:

* Assets: assetManager
* Root: userManager
* SWCqueue: admin, tgeAdmin
* Treasury: vaultManager
* UserDirectory: admin, userManager, admin
* Vault: treasury, uouOracle
* Roles: admin, restarter, stopper
* Token: admin, minter
* TokenLogic: admin, userManager

### Roles per function

* Assets.addAsset(ERC20 token, address src, uint128 wad) roleOrOwner("assetManager")
* Assets.transfer(ERC20 token, address dst, uint128 wad) onlyOwner
* Assets.transferEth(address dst, uint wad) onlyOwner
* Assets.rmAsset(ERC20 token, address dst) roleOrOwner("assetManager")
* Assets.cleanStorage() roleOrOwner("assetManager")
* Root.setBRG(BridgeToken brg_) onlyOwner
* Root.setSWT(SweetToken swt_) onlyOwner
* Root.setTreasury(Treasury t) onlyOwner
* Root.setVaultConfig(VaultConfig vc) onlyOwner
* Root.setUserFactory(address userDirFactory_) onlyOwner
* Root.setWalletFactory(address walletFactory_) onlyOwner
* Root.setVaultFactory(address vaultFactory_) onlyOwner
* Root.removeDirectory(address owner) roleOrOwner("userManager")
* SWCqueue.setBRG(BridgeToken brg_) roleOrOwner("admin")
* SWCqueue.setNextBRGSWTratio(uint ratio) roleOrOwner("tgeAdmin")
* SWCqueue.directPledge(address who, uint128 wad) roleOrOwner("tgeAdmin")
* SWCqueue.logTrancheRelease(uint128 wad) roleOrOwner("tgeAdmin")
* SWCqueue.burn(uint128 brgAmount) roleOrOwner("tgeAdmin")
* Treasury.addVault(Vault v) onlyRole("vaultManager")
* UserDirectory.setACTIVE(bool active_) onlyRole("userManager")
* UserDirectory.addWallet() roleOrOwner("userManager")
* UserDirectory.removeWallet(address wallet_) onlyOwner
* UserDirectory.transfer(address token, address to, uint value) onlyRole("admin")
* UserDirectory.transferEth(address to, uint value) onlyRole("admin")
* UserDirectory.removeWallet(address wallet_) onlyOwner
* Vault.takeOwnership() onlyRole("treasury")
* Vault.remove() onlyOwner
* Vault.requestUou(uint128 brgAmount) onlyOwner
* Vault.acceptUouRequest(uint uouIndex) onlyRole("uouOracle")
* Vault.rejectUouRequest(uint uouIndex) onlyRole("uouOracle")
* Wallet.remove() onlyOwner
* Wallet.addVault() onlyOwner
* Owned.setOwner(address owner_) onlyOwner
* Roles.stop() roleOrOwner("stopper")
* Roles.restart() roleOrOwner("restarter")
* Roles.setRolesContract(address roles_) onlyOwner
* Roles.addContractRole(bytes32 ctrct, string roleName) roleOrOwner("admin")
* Roles.removeContractRole(bytes32 ctrct, string roleName) roleOrOwner("admin")
* Roles.grantUserRole(bytes32 ctrct, string roleName, address user) roleOrOwner("admin")
* Roles.revokeUserRole(bytes32 ctrct, string roleName, address user) roleOrOwner("admin")
* Token.setLogic(TokenLogicI logic_) onlyOwner returns(bool)
* Token.mintFor(address recipient, uint128 wad) stoppable onlyRole("minter")
* Token.setName(string name_) roleOrOwner("admin")
* TokenData.setTokenLogic(address logic_) onlyOwner
* TokenLogic.addWhiteList(bytes32 listName) onlyRole("admin")
* TokenLogic.addToWhiteList(bytes32 listName, address guy) onlyRole("userManager")
* TokenLogic.removeFromWhiteList(bytes32 listName, address guy) onlyRole("userManager")
* TokenLogic.setFreeTransfer(bool isFree) onlyOwner
* TokenLogic.setToken(address token_) onlyOwner
