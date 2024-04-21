import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const abi = [
  [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pollId",
          "type": "uint256"
        }
      ],
      "name": "closePoll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "_options",
          "type": "string[]"
        }
      ],
      "name": "createPoll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "pollId",
          "type": "uint256"
        }
      ],
      "name": "PollClosed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "pollId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        }
      ],
      "name": "PollCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pollId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_optionId",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "pollId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "optionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        }
      ],
      "name": "Voted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pollId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_optionId",
          "type": "uint256"
        }
      ],
      "name": "getVotes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "hasVoted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "polls",
      "outputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
];

export default function App() {
    const [contract, setContract] = useState(null);
    const [polls, setPolls] = useState([]);
    const [pollVotes, setPollVotes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initEthers = async () => {
            try {
                if (typeof window.ethereum !== 'undefined') {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const tempContract = new ethers.Contract(contractAddress, abi, signer);
                    setContract(tempContract);
                    fetchPolls();  
                } else {
                    console.log("MetaMask is not installed!");
                }
            } catch (error) {
                console.error("Failed to initialize ethers or contract:", error);
            }
        };

        initEthers();
    }, []);

    const fetchPolls = async () => {
        try {
            setLoading(true);
            const pollsCount = await contract.polls.length;
            const pollsArray = [];
            const votesArray = [];
            for (let i = 0; i < pollsCount; i++) {
                const poll = await contract.polls(i);
                pollsArray.push(poll);
                const votes = await renderVotes(i);
                votesArray.push(votes);
            }
            setPolls(pollsArray);
            setPollVotes(votesArray);
        } catch (error) {
            console.error("Failed to fetch polls:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderVotes = async (pollId) => {
        try {
            const votes = [];
            for (let i = 0; i < polls[pollId].options.length; i++) {
                const voteCount = await contract.getVotes(pollId, i);
                votes.push(voteCount);
            }
            return votes;
        } catch (error) {
            console.error("Failed to fetch votes for poll:", error);
        }
    };

    const createPoll = async (title, options) => {
      try {
          await contract.createPoll(title, options);
          console.log("Poll created successfully.");
          await fetchPolls();
          console.log("Polls fetched successfully.");
      } catch (error) {
          console.error("Failed to create or fetch polls:", error);
      }
  };
  
  

    const vote = async (pollId, optionId) => {
        try {
            await contract.vote(pollId, optionId);
            fetchPolls();
        } catch (error) {
            console.error("Failed to vote:", error);
        }
    };

    const closePoll = async (pollId) => {
        try {
            await contract.closePoll(pollId);
            fetchPolls();
        } catch (error) {
            console.error("Failed to close poll:", error);
        }
    };

    return (
        <div>
            <h1>教育投票应用</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                polls.map((poll, index) => (
                    <div key={index}>
                        <h2>{poll.title}</h2>
                        {poll.options.map((option, idx) => (
                            <div key={idx}>
                                <button onClick={() => vote(index, idx)} disabled={!poll.isActive}>
                                    {option}
                                </button>
                                <span> - Votes: {pollVotes[index] && pollVotes[index][idx]}</span>
                            </div>
                        ))}
                        {poll.isActive && (
                            <button onClick={() => closePoll(index)}>关闭投票</button>
                        )}
                    </div>
                ))
            )}
            <button onClick={() => createPoll("新的投票", ["选项 1", "选项 2"])}>创建投票</button>
        </div>
    );
}


