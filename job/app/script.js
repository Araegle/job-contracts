import Aragon from '@aragon/client'
import { registryABI, resolverABI } from './abis/abi.json'
const namehash = require('eth-ens-namehash')

const app = new Aragon()

async function initialize() {
  var ensContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"resolver","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"label","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setSubnodeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"ttl","type":"uint64"}],"name":"setTTL","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"ttl","outputs":[{"name":"","type":"uint64"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"resolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"owner","type":"address"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":true,"name":"label","type":"bytes32"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"resolver","type":"address"}],"name":"NewResolver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"ttl","type":"uint64"}],"name":"NewTTL","type":"event"}]);
  var ens = ensContract.new({
      from: web3.eth.accounts[0],
      data: "0x33600060000155610220806100146000396000f3630178b8bf60e060020a600035041415610023576020600435015460405260206040f35b6302571be360e060020a600035041415610047576000600435015460405260206040f35b6316a25cbd60e060020a60003504141561006b576040600435015460405260206040f35b635b0fc9c360e060020a6000350414156100b8576000600435015433141515610092576002565b6024356000600435015560243560405260043560198061020760003960002060206040a2005b6306ab592360e060020a6000350414156101165760006004350154331415156100df576002565b6044356000600435600052602435602052604060002001556044356040526024356004356021806101e660003960002060206040a3005b631896f70a60e060020a60003504141561016357600060043501543314151561013d576002565b60243560206004350155602435604052600435601c806101ca60003960002060206040a2005b6314ab903860e060020a6000350414156101b057600060043501543314151561018a576002565b602435604060043501556024356040526004356016806101b460003960002060206040a2005b6002564e657754544c28627974657333322c75696e743634294e65775265736f6c76657228627974657333322c61646472657373294e65774f776e657228627974657333322c627974657333322c61646472657373295472616e7366657228627974657333322c6164647265737329",
      gas: 4700000
  }, function (e, contract){
      const registryAddress = contract.address;
  });
  const registry = app.external(registryAddress, registryABI);
  const resolver = app.external("0x5FfC014343cd971B7eb70732021E26C35B744cc4", resolverABI);
  app.call('openJob', /* hex("Job") */, "This is a job").
}

const applications = {}
const hired = {}

app.store(async (state, {event, returnValues}) => {
  if (state === null) state = applications

  switch (event.event) {
    case 'Applied':
      applications[returnValues.node] = { jobName: unhex(returnValues.jobName), resume: getResume(returnValues.node) }
    case 'Hired':
      hired = { node: returnValues.node, jobName: unhex(returnValues.jobName), resume: getResume(returnValues.node) }
    default:
      return state
  }
  return state
})

function getOwner(name) {
  return new Promise((resolve, reject) =>
    registry
      .owner(namehash.hash(name))
      .first()
      .subscribe(resolve, reject)
  )
}

function getResume(node) {
  return new Promise((resolve, reject) =>
    resolver
      .text(node, "resume")
      .first()
      .subscribe(resolve, reject)
  )
}

function setResume(name, resume) {
  return new Promise((resolve, reject) =>
    resolver
      .setText(namehash.hash(name), "resume", resume)
      .first()
      .subscribe(resolve, reject)
  )
}

function applyForJob(name) {
  // Get current value from the contract by calling the public getter
  return new Promise(resolve => {
    app
      .call('apply', namehash.hash(name), hex("Job"))
      .first()
      .subscribe(resolve)
  })
}

function hireApplicant(name) {
  // Get current value from the contract by calling the public getter
  return new Promise(resolve => {
    app
      .call('hire', namehash.hash(name), hex("Job"))
      .first()
      .subscribe(resolve)
  })
}
