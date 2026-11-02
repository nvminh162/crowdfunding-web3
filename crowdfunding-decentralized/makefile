-include .env

ANVIL_PRIVATE_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(ANVIL_PRIVATE_KEY) --broadcast

ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --account $(ACCOUNT) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) --gas-estimate-multiplier 500 -vvvv
endif

# Sepolia ETH/USD Chainlink feed
SEPOLIA_PRICE_FEED := 0x694AA1769357215DE4FAC081bf1f309aDC325306

deploy:
	@forge script script/DeployCrowdfunding.s.sol:DeployCrowdfunding $(NETWORK_ARGS)

# Preferred on Windows/Sepolia: forge create sets real tx gas-limit (forge script --gas-limit is block-gas-limit only)
# NOTE: --constructor-args must be LAST (it consumes all following tokens)
deploy-sepolia:
	@forge create src/Crowdfunding.sol:Crowdfunding --rpc-url $(SEPOLIA_RPC_URL) --account $(ACCOUNT) --broadcast --gas-limit 8000000 --verify --etherscan-api-key $(ETHERSCAN_API_KEY) --constructor-args $(SEPOLIA_PRICE_FEED)

fund:
	@forge script script/Interactions.s.sol:FundCrowdfunding $(NETWORK_ARGS)

withdraw:
	@forge script script/Interactions.s.sol:WithdrawCrowdfunding $(NETWORK_ARGS)