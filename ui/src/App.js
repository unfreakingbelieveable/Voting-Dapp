import './App.css';
import { accounts } from './web3';
import factory from './factory';
import Vote from './components/Vote';
import Form from './components/Form';
import React from 'react';

class App extends React.Component {

  refreshInterval;
  refreshTimeout = 10 * 1000;

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

  convertTime(epoch) {
    return Math.round(new Date(epoch).getTime() / 1000);
  }

  async createVote(event) {
    event.preventDefault();

    let _name = event.target[0].value;
    let _regEnd = this.convertTime(event.target[1].value);
    let _voteStart = this.convertTime(event.target[2].value);
    let _voteEnd = this.convertTime(event.target[3].value);

    try { 
      await factory.methods.addVote(_name, _regEnd, _voteStart, _voteEnd).send({ from: accounts[0] });
      event.target.reset();
    } catch (err) {

    }

    this.getVotes();
  }

  async componentDidMount() {
    await this.getVotes();

    this.refreshInterval = setInterval(this.getVotes, this.refreshTimeout);
  }

  async componentWillUnmount() {
    clearInterval(this.refreshInterval)
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
          <div className='vote-frame'>
            {voting}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
