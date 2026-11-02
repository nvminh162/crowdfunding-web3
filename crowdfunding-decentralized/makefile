-include .env

# Sepolia Chainlink ETH/USD price feed
SEPOLIA_PRICE_FEED := 0x694AA1769357215DE4FAC081bf1f309aDC325306

SEPOLIA_SCRIPT_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --account $(ACCOUNT) --broadcast -vvvv

# Primary deploy path (Windows + Sepolia): forge create sets a real tx gas limit.
# NOTE: --constructor-args must be LAST (it consumes every following token).
deploy deploy-sepolia:
	@forge create src/Crowdfunding.sol:Crowdfunding --rpc-url $(SEPOLIA_RPC_URL) --account $(ACCOUNT) --broadcast --gas-limit 8000000 --verify --etherscan-api-key $(ETHERSCAN_API_KEY) --constructor-args $(SEPOLIA_PRICE_FEED)

fund:
	@forge script script/Interactions.s.sol:FundCrowdfunding $(SEPOLIA_SCRIPT_ARGS)

withdraw:
	@forge script script/Interactions.s.sol:WithdrawCrowdfunding $(SEPOLIA_SCRIPT_ARGS)
