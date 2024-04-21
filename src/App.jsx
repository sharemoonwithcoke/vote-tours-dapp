import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const abi = [
  {
    "inputs": [
      {"internalType": "string", "name": "_title", "type": "string"},
      {"internalType": "string[]", "name": "_options", "type": "string[]"}
    ],
    "name": "createPoll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_pollId", "type": "uint256"},
      {"internalType": "uint256", "name": "_optionId", "type": "uint256"}
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_pollId", "type": "uint256"}
    ],
    "name": "closePoll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_pollId", "type": "uint256"},
      {"internalType": "uint256", "name": "_optionId", "type": "uint256"}
    ],
    "name": "getVotes",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function App() {
  const [contract, setContract] = useState(null);
  const [pollTitle, setPollTitle] = useState('');
  const [options, setOptions] = useState('');
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initEthers = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const tempContract = new ethers.Contract(contractAddress, abi, signer);
        setContract(tempContract);
        fetchPolls(tempContract);
      } else {
        console.log("Please install MetaMask!");
      }
    };

    initEthers();
  }, []);

  const createPoll = async () => {
    if (!pollTitle || !options) {
      return alert('Please provide a title and options for the poll.');
    }
    const optionsArray = options.split(',').map(opt => opt.trim());
    setLoading(true);
    try {
      await contract.createPoll(pollTitle, optionsArray);
      fetchPolls(contract); // Fetch polls again after creation
      setPollTitle('');
      setOptions('');
    } catch (error) {
      console.error('Failed to create poll:', error);
    } finally {
      setLoading(false);
    }
  };

  const vote = async (pollId, optionId) => {
    setLoading(true);
    try {
      await contract.vote(pollId, optionId);
      fetchPolls(contract); // Refresh polls after voting
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setLoading(false);
    }
  };

  const closePoll = async (pollId) => {
    setLoading(true);
    try {
      await contract.closePoll(pollId);
      fetchPolls(contract); // Refresh polls after closing
    } catch (error) {
      console.error('Failed to close poll:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPolls = async (contract) => {
  try {
    setLoading(true);
    const pollsCount = await contract.pollsCount();  // 假设合约中有一个方法返回投票数量
    const pollsArray = [];

    for (let i = 0; i < pollsCount; i++) {
      const pollData = await contract.getPollDetails(i);
      const poll = {
        id: i,
        title: pollData[0],
        options: pollData[1],
        isActive: pollData[2],
        votes: pollData[3]
      };
      pollsArray.push(poll);
    }

    setPolls(pollsArray);
  } catch (error) {
    console.error('Failed to fetch polls:', error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <h1>Education Voting Application</h1>
      <div>
        <input 
          value={pollTitle} 
          onChange={(e) => setPollTitle(e.target.value)} 
          placeholder="Poll Title"
        />
        <input 
          value={options} 
          onChange={(e) => setOptions(e.target.value)}
          placeholder="Option 1, Option 2, Option 3"
        />
        <button onClick={createPoll} disabled={loading || !contract}>
          Create Poll
        </button>
      </div>
      {polls.map((poll, index) => (
        <div key={index}>
          <h2>{poll.title}</h2>
          {poll.options.map((option, idx) => (
            <div key={idx}>
              <button onClick={() => vote(poll.id, idx)} disabled={!poll.isActive}>
                Vote for {option}
              </button>
            </div>
          ))}
          {poll.isActive && (
            <button onClick={() => closePoll(poll.id)}>Close Poll</button>
          )}
        </div>
      ))}
    </div>
  );
}


