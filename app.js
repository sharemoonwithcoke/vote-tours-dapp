const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const contractABI = [[
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
			}
		],
		"name": "getPollDetails",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPollsCount",
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
]]; 
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('pollForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); 
        createPoll();
    });
});

async function createPoll() {
    const title = document.getElementById('title').value;
    const options = document.getElementById('options').value.split('\n').filter(o => o.trim() !== '');

    if (!window.ethereum) {
        alert('Please install MetaMask。');
        return;
    }

    if (!ethereum.isConnected()) {
        await ethereum.request({ method: 'eth_requestAccounts' });
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
        const tx = await contract.createPoll(title, options);
        await tx.wait();
        alert('Create Poll Successfully!');
        document.getElementById('title').value = ''; 
        document.getElementById('options').value = ''; 
    } catch (error) {
        console.error(error);
        alert('Create Poll Failed.');
    }
}
async function createPoll() {
    const title = document.getElementById('title').value;
    const options = document.getElementById('options').value.split('\n');

    if (!window.ethereum) {
        alert('Please install MetaMask first.');
        return;
    }

    if (!ethereum.isConnected()) {
        await ethereum.request({ method: 'eth_requestAccounts' });
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
        const tx = await contract.createPoll(title, options);
        await tx.wait();
        alert('Poll created successfully!');
    } catch (error) {
        console.error(error);
        alert('Failed to create poll.');
    }
}

