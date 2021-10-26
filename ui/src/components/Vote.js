import '../App.css';
import React from 'react';
import { web3, accounts } from '../web3';
const voteABI = require('../abi/Vote.json');

const noCandidatesMsg = 'No candidates yet. Try adding one!';

class Vote extends React.Component {

    voteInterval;
    contract;
    refreshTimeout = 3000;

    state = {
        currTime: 0,
        address: '',
        name: '',
        contract: undefined,
        candidateNames: [],
        numVotes: 0,
        voteMap: {},
        regEnd: 0,
        voteStart: 0,
        voteEnd: 0,
    }

    constructor() {
        super();
        this.addCandidate = this.addCandidate.bind(this);
        this.vote = this.vote.bind(this);
        this.calculateVotes = this.calculateVotes.bind(this);
        this.getCandidates = this.getCandidates.bind(this);
        this.updateData = this.updateData.bind(this);
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

    async updateTime() {
        let temp = Math.round(Date.now() / 1000)
        this.setState({ currTime: temp });

        temp = await this.state.contract.methods.regEnd().call();
        this.setState({ regEnd: temp });

        temp = await this.state.contract.methods.voteStart().call();
        this.setState({ voteStart: temp });

        temp = await this.state.contract.methods.voteEnd().call();
        this.setState({ voteEnd: temp });
    }

    async updateData() {
        await this.updateTime();
        await this.getCandidates();
        await this.calculateVotes();
    }

    async componentDidMount() {
        let temp;
        this.setState({ address: this.props.address });

        this.contract = await this.getContract(this.props.address);
        this.setState({ contract: this.contract });

        temp = await this.contract.methods.name().call();
        this.setState({ name: temp })

        await this.updateData();

        this.voteInterval = setInterval(this.updateData, this.refreshTimeout);

    }

    async componentWillUnmount() {
        clearInterval(this.voteInterval);
    }

    render() {
        let _now = this.state.currTime;

        let candidates;
        if (this.state.candidateNames.length > 0) {
            candidates = this.state.candidateNames.map((candidate) => {
                let _voteBtn;
                if(_now > this.state.voteStart && _now < this.state.voteEnd) {
                    _voteBtn = <button value={candidate} onClick={this.vote}>Vote</button>
                }

                let _percentVotes = Math.round((this.state.voteMap[candidate] / this.state.numVotes) * 100)
                if (isNaN(_percentVotes)) { _percentVotes = 0 }

                return (<div className='flex' >
                            <p>{candidate}</p>
                            <p>{_voteBtn}</p>
                            <p>{_percentVotes}%</p>
                        </div>
                )
            });
        } else {
            candidates = noCandidatesMsg;
        }

        let _form;
        if (_now < this.state.regEnd) {
            _form = ( 
                <form onSubmit={this.addCandidate} >
                    <input type="text" placeholder="Candidate Name" />
                    <input type='submit' value='Add Candidate' />
                </form>
            )
        }

        return (<div className="vote-container" >
                    <p className="vote-title">{this.state.name}</p>
                    {this.state.numVotes} Votes
                    {_form}
                    {candidates}
                </div>
        );
    }
}

export default Vote;