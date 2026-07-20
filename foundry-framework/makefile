-include .env

# Windows PATH format cho Make (dung C:/Users/nvmin/.foundry/bin)
export PATH := C:/Users/nvmin/.foundry/bin;$(PATH)

anvil:
	anvil

deploy-anvil:
	forge script script/DeploySimpleStorage.s.sol --rpc-url ${ANVIL_RPC_URL} --broadcast --account nvminh162-anvil

deploy-sepolia:
	forge script script/DeploySimpleStorage.s.sol --rpc-url ${SEPOLIA_RPC_URL} --broadcast --account foundry-learn --verify --etherscan-api-key ${ETHERSCAN_API_KEY}
