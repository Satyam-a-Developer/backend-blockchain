import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Replace this with your deployed contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// ABI for your Message contract (you'll get this from your hardhat artifacts)
const CONTRACT_ABI = [
  "function setMessage(string memory newMessage) public",
  "function getMessage() public view returns (string memory)"
];

function App() {
  const [message, setMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    initializeEthers();
  }, []);

  const initializeEthers = async () => {
    try {
      if (window.ethereum) {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contract);

        try {
          // Get initial message
          const currentMessage = await contract.getMessage();
          setMessage(currentMessage);
        } catch (err) {
          console.error('Error fetching message:', err);
          setError('Error fetching message');
        }
      } else {
        setError('Please install MetaMask to use this dApp');
      }
    } catch (err) {
      console.error('Error initializing the dApp:', err);
      setError('Error initializing the dApp');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setLoading(true);
      setError('');

      // Call setMessage to update the message on the blockchain
      const tx = await contract.setMessage(newMessage);
      await tx.wait();

      // Fetch the updated message after the transaction is mined
      const updatedMessage = await contract.getMessage();
      setMessage(updatedMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Error updating message:', err);
      setError('Error updating message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Message dApp</h1>

        {error && <p className="error">{error}</p>}

        <div className="current-message">
          <h2>Current Message:</h2>
          <p>{message || 'No message set'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter new message"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !contract}>
            {loading ? 'Updating...' : 'Update Message'}
          </button>
        </form>
      </header>
    </div>
  );
}

export default App;
