// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

import {PriceConverter} from "./PriceConverter.sol";

contract Crowdfunding {
    using PriceConverter for uint256;

    error NoAvailableAmount();

    uint256 public constant MININUM_USD = 5e18; // 5 USD in Wei
    address public immutable i_owner;

    mapping(address funder => bool isFunded) public isFunders;
    mapping(address funder => uint256 value) public funderToAmount;
    address[] public funders;

    event Funded(address indexed funder, uint256 value);
    event Withdrawn(address indexed owner, uint256 value);

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    constructor() {
        i_owner = msg.sender;
    }

    modifier onlyOwner() {
        if (i_owner != msg.sender) {
            revert NoAvailableAmount();
        }
        _;
    }

    function fund() public payable {
        require(msg.value.getConversionRate() >= MININUM_USD, "No available amount");
        funderToAmount[msg.sender] += msg.value;
        bool isFunded = isFunders[msg.sender];
        
        if (!isFunded) {
            funders.push(msg.sender);
            isFunders[msg.sender] = true;
        }

        emit Funded(msg.sender, msg.value);
    }

    function withDraw() public onlyOwner {
        (bool sent, ) = payable(i_owner).call{value: address(this).balance}("");
        require(sent, "Failed to send ether");
        emit Withdrawn(i_owner, address(this).balance);


    }

    function getFundersLength() public view returns (uint256) {
        return funders.length;
    }
}
