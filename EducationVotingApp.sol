// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EducationVoting {

    struct Poll {
        string title;
        string[] options;
        bool isActive;
        mapping(uint => uint) votes; // optionId => vote count
    }

    Poll[] public polls;
    mapping(address => mapping(uint => bool)) public hasVoted; // voter => pollId => voted

    // Events for logging activities
    event PollCreated(uint pollId, string title);
    event Voted(uint pollId, uint optionId, address voter);
    event PollClosed(uint pollId);
    
    // Function to create a new poll
    function createPoll(string memory _title, string[] memory _options) public {
        polls.push();
        uint pollId = polls.length - 1;
        Poll storage poll = polls[pollId];
        poll.title = _title;
        poll.options = _options;
        poll.isActive = true;
        emit PollCreated(pollId, _title);
    }

    // Function to vote on a poll option
    function vote(uint _pollId, uint _optionId) public {
        require(polls[_pollId].isActive, "Poll is not active.");
        require(!hasVoted[msg.sender][_pollId], "Already voted.");
        require(_optionId < polls[_pollId].options.length, "Invalid option.");

        hasVoted[msg.sender][_pollId] = true;
        polls[_pollId].votes[_optionId]++;
        
        emit Voted(_pollId, _optionId, msg.sender);
    }

    // Function to get total votes for an option in a poll
    function getVotes(uint _pollId, uint _optionId) public view returns (uint) {
        require(_optionId < polls[_pollId].options.length, "Invalid option.");
        return polls[_pollId].votes[_optionId];
    }

    // Function to close a poll
    function closePoll(uint _pollId) public {
        require(polls[_pollId].isActive, "Poll is already closed.");
        polls[_pollId].isActive = false;
        emit PollClosed(_pollId);
    }
}

