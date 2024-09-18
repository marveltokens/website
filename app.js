window.addEventListener('load', async () => {
  const connectWalletBtn = document.getElementById('connectWallet');
  const buyTokenBtn = document.getElementById('buyToken');

  // Initialize Web3
  let web3;
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
  } else {
    alert('MetaMask is required to use this feature.');
    return;
  }

  // Contract details
  const contractAddress = '0xa8e1463484da82dc3cfbd8b697a47390e12896dd';
  const abi = [
    {
      "inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],
      "name":"transfer",
      "outputs":[{"internalType":"bool","name":"","type":"bool"}],
      "stateMutability":"nonpayable",
      "type":"function"
    }
  ];

  // Initialize contract
  const contract = new web3.eth.Contract(abi, contractAddress);

  // Connect MetaMask and handle account changes
  async function connect() {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      handleAccountsChanged(accounts);
    } catch (error) {
      if (error.code === 4001) {
        console.log('Please connect to MetaMask.');
      } else {
        console.error(error);
      }
    }
  }

  // Handle account changes
  function handleAccountsChanged(accounts) {
    if (accounts.length > 0) {
      console.log('Wallet connected:', accounts[0]);
      connectWalletBtn.innerText = 'Wallet Connected';
    } else {
      console.log('No accounts found.');
    }
  }

  // Button to connect wallet
  connectWalletBtn.addEventListener('click', connect);

  // Button to buy token
  buyTokenBtn.addEventListener('click', async () => {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];
      const tokenAmount = web3.utils.toWei('1', 'ether'); // Change amount as needed

      // Call contract method
      await contract.methods.transfer(userAddress, tokenAmount).send({ from: userAddress });

      alert('Purchase successful!');
    } catch (error) {
      console.error(error);
      alert('Purchase failed. See console for details.');
    }
  });
});
