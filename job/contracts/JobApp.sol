pragma solidity ^0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "./ENS.sol";

contract JobApp is AragonApp {

    /// Events
    event Applied(bytes32 node, bytes32 jobName);
    event Hired(bytes32 node, bytes32 jobName);
    event JobOpened(bytes32 indexed name, string description);
    event JobClosed(bytes32 indexed name, bytes32 _hiree);

    /// State
    ENS ens = ENS(0x314159265dD8dbb310642f98f50C066173C1259b);

    struct Job {
        string description;
        bool open;
        bool exists;
    }

    mapping (bytes32 => Job) internal jobs;
    mapping (bytes32 => bool) internal applications;
    mapping (bytes32 => bool) internal hired;

    /// ACL
    bytes32 constant public OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 constant public MANAGER_ROLE = keccak256("MANAGER_ROLE");

    function apply(bytes32 node, bytes32 jobName) external {
        require(msg.sender == nodeOwner(node));
        require(!hasApplied(node, jobName));
        require(jobs[keccak256(jobName)].open);
        applications[keccak256(node, jobName)] = true;
        Applied(node, jobName);
    }

    function openJob(bytes32 _name, string _description) external auth(OWNER_ROLE) {
        require(! jobs[_name].exists);

        Job memory job = Job({
            description: _description,
            open: true,
            exists: true
        });

        jobs[keccak256(_name)] = job;
        JobOpened(_name, _description);
    }

    function closeJob(bytes32 _name, bytes32 _node) external auth(OWNER_ROLE) {
        require(jobs[keccak256((_name))].open);
        jobs[keccak256(_name)].open = false;
        JobClosed(_name, _node);
    }

    function hire(bytes32 node, bytes32 jobName) external auth(MANAGER_ROLE) {
        require(hasApplied(node, jobName));
        require(!hasBeenHired(node, jobName));
        require(jobs[keccak256(jobName)].open);
        hired[keccak256(node, jobName)] = true;
        Hired(node, jobName);
    }

    function getJobDetails(bytes32 _name) public view returns(string, string) {
        require(jobs[_name].exists);
        string memory description = jobs[keccak256(_name)].description;
        string memory status = jobs[keccak256(_name)].open ? "Open" : "Closed";
        return (description, status);
    }

    function hasApplied(bytes32 _node, bytes32 _job) public view returns(bool) {
        return applications[keccak256(_node, _job)];
    }

    function hasBeenHired(bytes32 _node, bytes32 _job) public view returns(bool) {
        return hired[keccak256(_node, _job)];
    }

    function nodeOwner(bytes32 _node) public view returns(address) {
        return ens.owner(_node);
    }
}
