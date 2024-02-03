import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import EtherSwap from '../abis/EtherSwap.json'; // Make sure to have EtherSwap ABI
import Navbar from './Navbar';
import Main from './Main';
import './App.css';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

async loadBlockchainData() {
  const web3 = window.web3;

  const accounts = await web3.eth.getAccounts();
  this.setState({ account: accounts[0] });

  const etherBalance = await web3.eth.getBalance(this.state.account);
  this.setState({ etherBalance });

  // Load Token using ABI from ./abis/Token.json
  const token = new web3.eth.Contract(Token.abi, "0x12b52c7A24161AEeEa6Ae63Cc5fcebaa75691A03");
  this.setState({ token });

  // Load EtherSwap using ABI from ./abis/EtherSwap.json
  const etherSwap = new web3.eth.Contract(EtherSwap.abi, "0x78ce3d5f69022Fb6390B2Cbdbc1F35aC507f7823");
  this.setState({ etherSwap });

  let tokenBalance = await token.methods.balanceOf(this.state.account).call();
  this.setState({ tokenBalance: tokenBalance.toString() });

  this.setState({ loading: false });
}

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

buyTokens = async (etherAmount) => {
  this.setState({ loading: true });

  try {
    // Convert etherAmount to Wei
    const etherAmountWei = window.web3.utils.toWei(etherAmount, 'Ether');

    // Call the buyTokens function from EtherSwap contract
    await this.state.etherSwap.methods
      .buyTokens()
      .send({ value: etherAmountWei, from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({ loading: false });
      });
  } catch (error) {
    this.setState({ loading: false });
    console.error(error);
  }
};

  sellTokens = async (tokenAmount) => {
    this.setState({ loading: true });

    try {
      // Approve EtherSwap to spend tokens
      await this.state.token.methods.approve(this.state.etherSwap._address, tokenAmount).send({ from: this.state.account });

      // Call the sellTokens function from EtherSwap contract
      await this.state.etherSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account })
        .on('transactionHash', (hash) => {
          this.setState({ loading: false });
        });
    } catch (error) {
      this.setState({ loading: false });
      console.error(error);
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      token: {},
      etherSwap: {},
      etherBalance: '0',
      tokenBalance: '0',
      loading: true,
    };
  }

  render() {
    let content;

    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>;
    } else {
      content = <Main
        etherBalance={this.state.etherBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
      />;
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

