-include .env

ANVIL_PRIVATE_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(ANVIL_PRIVATE_KEY) --broadcast

ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --account $(ACCOUNT) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv
endif

deploy:
	@forge script script/DeployCrowdfunding.s.sol:DeployCrowdfunding $(NETWORK_ARGS)

deploy-sepolia:
	@forge script script/DeployCrowdfunding.s.sol:DeployCrowdfunding --rpc-url $(SEPOLIA_RPC_URL) --account $(ACCOUNT) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv

fund:
	@forge script script/Interactions.s.sol:FundCrowdfunding $(NETWORK_ARGS)

fund-sepolia:
	@forge script script/Interactions.s.sol:FundCrowdfunding --rpc-url $(SEPOLIA_RPC_URL) --account $(ACCOUNT) --broadcast -vvvv

withdraw:
	@forge script script/Interactions.s.sol:WithdrawCrowdfunding $(NETWORK_ARGS)

withdraw-sepolia:
	@forge script script/Interactions.s.sol:WithdrawCrowdfunding --rpc-url $(SEPOLIA_RPC_URL) --account $(ACCOUNT) --broadcast -vvvv