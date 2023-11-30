// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { LibDiamond } from "../libraries/LibDiamond.sol";

contract ManagerTestFacet {
    function getProjectInfo() external view returns (LibDiamond.ProjectConfig memory pc){
        return LibDiamond.diamondStorage().project[LibDiamond.INNER_STRUCT];
  }

  function changeName(string memory _name) external {
    LibDiamond.diamondStorage().project[LibDiamond.INNER_STRUCT].name = _name;
  }
}
