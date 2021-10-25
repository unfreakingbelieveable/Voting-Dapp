import './App.css';
import { accounts } from './web3';
import factory from './factory';
import Vote from './components/Vote';
import Form from './components/Form';
import React from 'react';

const style = { display: 'flex'}

class App extends React.Component {

  state = {
    votes: [],
  }

  constructor() {
    super()
    this.getVotes = this.getVotes.bind(this)
    this.createVote = this.createVote.bind(this)
  }

  async getVotes() {
    let votes = await factory.methods.getVotes().call();
    this.setState({ votes });
  }

  async createVote(event) {
    event.preventDefault();

    let now = Math.round(Date.now() / 1000)

    let _name = event.target[0].value;

    // let _regEnd = event.target[1].value
    let _regEnd = now + 5;

    // let _voteStart = event.target[2].value;
    let _voteStart = now + 10;

    // let _voteEnd = event.target[3].value;
    let _voteEnd = now + 15;

    await factory.methods.addVote(_name, _regEnd, _voteStart, _voteEnd).send({ from: accounts[0] });

    this.getVotes();
  }

  async componentDidMount() {
    await this.getVotes();
  }

  render() {
    let voting;
    if(this.state.votes.length === 0) {
      voting = <p>Nothing yet!</p>;    
    } else {
      voting = this.state.votes.map( (vote) => {
        return <Vote address={vote} key={vote} />
      });
    }

    return (
      <div className="App">
        <header className="App-header">
          <p>Voting Happens Here</p>
          <Form createVote={this.createVote} />
          <div className='vote-frame' style={style}>
            {voting}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
