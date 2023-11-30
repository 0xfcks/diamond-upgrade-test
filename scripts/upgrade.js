/* global ethers */
/* eslint prefer-const: "off" */

const { FacetCutAction, getDeploymentProjectCalldata, getSelector, getSelectors } = require('./libraries/diamond.js')

async function upgradeDiamond () {
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]

  // initialize new DiamondInit contract  
  const diamondInitAddress = "0xe6d9cFC2C0D2205c6b1Af986722269263E1b8a08"
  const diamondInit = await ethers.getContractAt('DiamondInit', diamondInitAddress)  

  // Deploy facets and set the `facetCuts` variable
  console.log('')
  console.log('Constructing facet cuts')
  const FacetNames = [
    'ManagerTestFacet',
    'Test1Facet'
  ]

  // The `facetCuts` variable is the FacetCut[] that contains the functions to add during diamond deployment
  const facetCuts = []
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName)  
    if(FacetName === 'ManagerTestFacet'){     
      
      // const Facet = await ethers.getContractFactory(FacetName)
      // const facet = await Facet.deploy()
      // await facet.deployed()

      // remove prior getProjectInfo selector
      facetCuts.push({
        facetAddress: ethers.constants.AddressZero,
        action: FacetCutAction.Remove,
        functionSelectors: ['0x67c897fe']
      })

      // add new ManagerFacet selectors
      facetCuts.push({
        facetAddress: "0xb3eefBc1b4093c4a57c3258C35cbE07Bd7F32257",
        action: FacetCutAction.Add,
        functionSelectors: ['0x67c897fe']
      })
    } 
    // else if(FacetName === 'Test1Facet'){
    //   facetCuts.push({
    //     facetAddress: "0x2FBDF190E98AfAdD4482E8828053553AeB96cD68",
    //     action: FacetCutAction.Add,
    //     functionSelectors: getSelectors(Facet).filter( selector => selector !== '0x0716c2ae')
    //   })
    //   facetCuts.push({
    //     facetAddress: ethers.constants.AddressZero,
    //     action: FacetCutAction.Remove,
    //     functionSelectors: ['0x19e3b533']
    //   })
    // }
  }

  // Creating a function call
  // This call gets executed during deployment and can also be executed in upgrades
  // It is executed with delegatecall on the DiamondInit address.
  const calldata = getDeploymentProjectCalldata( config )
  let functionCall = diamondInit.interface.encodeFunctionData("init(bytes)", [calldata]);
  console.log(functionCall)
   
  // apply diamondCut
  const diamondAddress = '0xaEaB7116b92dF4E6D553B057b956a8D76e9D5bDc'
  diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddress)
  console.log(facetCuts, diamondInitAddress, functionCall)
  await diamondCutFacet.diamondCut(facetCuts, diamondInitAddress, functionCall)
  console.log()
  console.log('Diamond upgraded')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  upgradeDiamond()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

exports.upgradeDiamond = upgradeDiamond
