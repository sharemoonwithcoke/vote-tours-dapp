// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract EducationVotingApp{
    struct Voter {
        bool voted;
        uint role; 
    }

    struct Option {
        string name;
        uint voteCount;
    }

    enum Topic { Course, Method, Content }

    mapping(address => Voter) public voters;
    Option[] public courses;
    Option[] public methods;
    mapping(uint => Option[]) public contentOptions;

    address public admin;

    constructor() {
    }
        admin = msg.sender;
      
        addOption(courses, "History");
        addOption(courses, "Physics");
        addOption(courses, "Philosophy");
        addOption(courses, "Computer Science");

        addOption(methods, "Lecture");
        addOption(methods, "Group Discussion");
        addOption(methods, "Experiment");
        addOption(methods, "Project");

       
        addContentOption(0, "World History");
        addContentOption(0, "National History");
        addContentOption(1, "Quantum Physics");
        addContentOption(1, "Classical Physics");
        addContentOption(2, "Dialectic Thinking");
        addContentOption(2, "History of Philosophy");
        addContentOption(3, "Java Programming");
        addContentOption(3, "Web Development");
    }

    function addOption(Option[] storage optionsArray, string memory name) private {
        optionsArray.push(Option(name, 0));
    }

    function addContentOption(uint courseIndex, string memory contentName) private {
        contentOptions[courseIndex].push(Option(contentName, 0));
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function registerVoter(address voter, uint role) public onlyAdmin {
        require(!voters[voter].voted, "Voter already registered");
        voters[voter].role = role;
    }

    function vote(uint topic, uint optionId) public {
        require(!voters[msg.sender].voted, "Already voted");
        voters[msg.sender].voted = true;

        if (topic == uint(Topic.Course)) {
            require(voters[msg.sender].role == 1 || voters[msg.sender].role == 2 || voters[msg.sender].role == 3, "Unauthorized role for this vote");
            courses[optionId].voteCount++;
        } else if (topic == uint(Topic.Method)) {
            require(voters[msg.sender].role == 1 || voters[msg.sender].role == 2, "Unauthorized role for this vote");
            methods[optionId].voteCount++;
        } else if (topic == uint(Topic.Content)) {
            require(voters[msg.sender].role == 1, "Unauthorized role for this vote");
            contentOptions[optionId / 10][optionId % 10].voteCount++;
        }
    }

    function getVoteCounts(uint topic, uint optionId) public view returns (uint) {
        if (topic == uint(Topic.Course)) {
            return courses[optionId].voteCount;
        } else if (topic == uint(Topic.Method)) {
            return methods[optionId].voteCount;
        } else if (topic == uint(Topic.Content)) {
            return contentOptions[optionId / 10][optionId % 10].voteCount;
        }
        return 0;
    }
}

