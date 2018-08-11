pragma solidity ^0.4.19;

import "@aragon/os/contracts/apps/AragonApp.sol";

contract JobApp is AragonApp {

    /// Events
    event Applied(bytes32 node, string jobName);
    event JobOpened(string indexed name, string description);
    event Advanced(bytes32 node, string jobName);
    event Hired(bytes32 node, string jobName);

    /// State
    ENS ens = ENS(ens_address);
    enum JobStatus { NowHiring, Interviewing, HiringClosed }
    struct Job {
      string description;
      JobStatus status;
    }
    mapping (bytes32 => Job) internal jobs;
    mapping (bytes32 => bool) internal applications;
    mapping (bytes32 => bool) internal interviewing;
    mapping (bytes32 => bool) internal hired;

    /// ACL
    bytes32 constant public OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 constant public MANAGER_ROLE = keccak256("MANAGER_ROLE");

    /**
     * @notice Apply for a job by `jobName`
     * @param step Amount to increment by
     */
    function apply(bytes32 node, string jobName) external {
        require(msg.sender == nodeOwner(node));
        applications[keccak256(node, jobName)] = true;
        Applied(node, jobName);
    }

    /**
     * @notice Open a job the counter by `step`
     * @param step Amount to decrement by
     */
    function openJob(string _name, string _description) auth(OWNER_ROLE) external {
        Job memory job = Job({
            description: _description,
            status: //how to declare enum
        });
        jobs[keccak256(_name)] = job;
        JobOpened(_name, _description);
    }

    /**
     * @notice Apply for a job by `jobName`
     * @param step Amount to increment by
     */
    function advanceToInterview(bytes32 node, string jobName) auth(MANAGER_ROLE) external {
        interviewing[keccak256(node, jobName)] = true;
        Advanced(node, jobName);
    }

    /**
     * @notice Apply for a job by `jobName`
     * @param step Amount to increment by
     */
    function hire(bytes32 node, string jobName) auth(MANAGER_ROLE) external {
        hired[keccak256(node, jobName)] = true;
        Hired(node, jobName);
    }
}
