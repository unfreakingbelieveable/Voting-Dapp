import '../App.css';
import React from 'react';
import { web3, accounts } from '../web3';
const voteABI = require('../abi/Vote.json');

const noCandidatesMsg = 'No candidates yet. Try adding one!';

class Vote extends React.Component {

    state = {
        address: '',
        name: '',
        contract: undefined,
        candidateNames: [],
    }

    constructor() {
        super();
        this.addCandidate = this.addCandidate.bind(this);
        this.vote = this.vote.bind(this);
    }

    async vote(event) {
        event.preventDefault();
        let _name = event.target.value;
        await this.state.contract.methods.vote(_name).send({ from: accounts[0] });
    }

    async getCandidates() {
        let candidateNames = await this.state.contract.methods.getCandidates().call();
        this.setState({ candidateNames });
    }

    async addCandidate(event) {
        event.preventDefault();
        await this.state.contract.methods.addCandidate(event.target[0].value).send({ from: accounts[0] });
        this.getCandidates();
    }

    async getContract(_address) {
        return (
            new web3.eth.Contract(voteABI.abi, _address)
        );
    }

    async componentDidMount() {
        let temp;
        this.setState({ address: this.props.address });

        temp = await this.getContract(this.props.address);
        this.setState({contract: temp});

        temp = await temp.methods.name().call();
        this.setState({ name: temp })

        this.getCandidates();
    }

    render() {
        let candidates;

        if (this.state.candidateNames.length > 0) {
            candidates = this.state.candidateNames.map((candidate) => {
                return (<div className='flex' >
                            <p>{candidate}</p>
                            <button value={candidate} onClick={this.vote}>Vote</button>
                        </div>
                )
            });
        } else {
            candidates = noCandidatesMsg;
        }

        return (<div className="vote-container" >
                    <p className="vote-title">{this.state.name}</p>
                    <form onSubmit={this.addCandidate} >
                        <input type="text" placeholder="Candidate Name" />
                        <input type='submit' value='Add Candidate' />
                    </form>
                    {candidates}
                </div>
        );
    }
}

export default Vote;