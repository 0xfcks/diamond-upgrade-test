// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Example library to show a simple example of diamond storage

library TestLib {

  bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("diamond.standard.test.storage");
  
  struct TestState {
      address myAddress;
      uint256 myNum;
  }

  function diamondStorage() internal pure returns (TestState storage ds) {
      bytes32 position = DIAMOND_STORAGE_POSITION;
      assembly {
          ds.slot := position
      }
  }

  function setMyAddress(address _myAddress) internal {
    TestState storage testState = diamondStorage();
    testState.myAddress = _myAddress;
  }

  function getMyAddress() internal view returns (address) {
    TestState storage testState = diamondStorage();
    return testState.myAddress;
  }
}

contract Test1Facet {
    event TestEvent(address something);

   function test1Func1(address _address) external {
      TestLib.setMyAddress(_address);
    }

    function test1Func2() external view returns (address){
      return TestLib.getMyAddress();
    }    
}
