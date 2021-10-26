import '../App.css';
import React from 'react';
import { web3, accounts } from '../web3';
const voteABI = require('../abi/Vote.json');

const noCandidatesMsg = 'No candidates yet. Try adding one!';

class Vote extends React.Component {

    intervalID;

    state = {
        address: '',
        name: '',
        contract: undefined,
        candidateNames: [],
        numVotes: 0,
        voteMap: {},
    }

    constructor() {
        super();
        this.addCandidate = this.addCandidate.bind(this);
        this.vote = this.vote.bind(this);
        this.calculateVotes = this.calculateVotes.bind(this);
    }

    async calculateVotes() {
        let _votes = await Promise.all(this.state.candidateNames.map( async _name => {
            let _v = await this.state.contract.methods.candidates(_name).call();
            return _v;
        }));
        
        let _total = 0;
        _votes.forEach( _v => {
            if(_v !== undefined) { 
                _total += parseInt(_v.numVotes);

                let _oldMap = this.state.voteMap;
                _oldMap[_v.name] = _v.numVotes;
                this.setState({ voteMap: _oldMap});
            }
        });
        this.setState({ numVotes: _total })
    }

    async vote(event) {
        event.preventDefault();
        let _name = event.target.value;
        await this.state.contract.methods.vote(_name).send({ from: accounts[0] });
    }

    async getCandidates() {
        let candidateNames = await this.state.contract.methods.getCandidates().call();
        this.setState({ candidateNames }, async () => await this.calculateVotes());
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

        this.intervalID = setInterval(this.calculateVotes, 5000);

    }

    async componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    render() {

        let candidates;

        console.log(this.state.voteMap);

        if (this.state.candidateNames.length > 0) {
            candidates = this.state.candidateNames.map((candidate) => {
                let _percentVotes = (this.state.voteMap[candidate] / this.state.numVotes) * 100
                return (<div className='flex' >
                            <p>{candidate}</p>
                            <button value={candidate} onClick={this.vote}>Vote</button>
                            {_percentVotes}%
                        </div>
                )
            });
        } else {
            candidates = noCandidatesMsg;
        }

        return (<div className="vote-container" >
                    <p className="vote-title">{this.state.name}</p>
                    {this.state.numVotes}
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