import Web3 from 'web3';
import React from 'react';
import Prng from './prng';

const ENDPOINT = 'https://mainnet.infura.io/v3/d36d63effd8e44dcbd02fc1c61790b73';
const web3 = new Web3(ENDPOINT);

export default class Main extends React.Component {
  state = {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    prng: null,
  }

  canvasRef = React.createRef();

  seed(address) {
    let seedValue = address.match(/(0x)?([a-z0-9]+)/i)[2].match(/([a-z0-9]){6,8}/ig)
      .map(a => parseInt(a, 16))
      .reduce((a,b) => (a ^ b)) >>> 0;
    const prng = new Prng((seedValue & 0xffff), (seedValue >> 16) & 0xffff, (seedValue >> 24) & 0xffff);

    this.setState({...this.state, address, seedValue: seedValue});
    this.prng = prng;
    this.draw();
  }

  async getAddressInfo() {
    const {address} = this.state;
    this.setState({...this.state, busy: true});

    const balance = await web3.eth.getBalance(address);
    this.setState({...this.state, busy: false, balance});
  }

  draw() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 256, 256);
    for(let i=0; i<8; i++) {
      for(let j=0; j<8; j++) {
        const color = `#${this.prng.nextInt().toString(16).slice(0, 6).padStart(6, '0')}`;
        ctx.fillStyle = color;
        ctx.fillRect(i * 32, j * 32, 32, 32);
      }
    }
  }

  render() {
    return (
      <div>
        <p>
          Enter account address
        </p>
        <input
          maxLength="42"
          autoFocus={true}
          style={{minWidth: '60vw', minHeight: '3rem', padding: '1rem', textAlign: 'center', fontSize: '2rem', }}
          value={this.state.address}
          onChange={({target: {value}}) => this.seed(value)}/>

        <div>
          <button style={{minWidth: '10rem', height: '4rem', fontSize: '2rem', margin: '1rem', }}
            onClick={this.getAddressInfo.bind(this)}
          >
            Go
          </button>
        </div>

        <canvas ref={this.canvasRef} width="256" height="256"></canvas>


        <div>
          {
            this.state.seedValue ? 
              <h2>
                Seed value: {this.state.seedValue.toString(16)}
              </h2>
              : null
          }
        </div>
        <div>
          <h2>
            Account Balance: {this.state.balance} <img src="https://d33wubrfki0l68.cloudfront.net/f1b1b448efe42ab7b1475f1ea87e5a135d608289/298f3/static/a110735dade3f354a46fc2446cd52476/0ee04/eth-home-icon.png"  alt="" />
          </h2>
        </div>

        {this.state.busy && 
        <p>
          Please wait
        </p>
        }
      </div>
    );
  };
};
