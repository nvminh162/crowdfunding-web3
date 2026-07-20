// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {Test,console} from "forge-std/Test.sol";
import {Crowdfunding} from "src/Crowdfunding.sol";

contract CrowdfundingTest is Test {

    uint256 number;
    Crowdfunding public crowdfunding;

	function setUp() external {
        number = 2;
        crowdfunding = new Crowdfunding();
    }

    function testNumber() public {
        assertEq(number, 2);
    }

    function test_setUp() public view {
        console.log(address(crowdfunding));
    }
}
