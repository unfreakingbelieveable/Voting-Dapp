import React from 'react';
import { web3 } from '../web3';
const voteABI = require('../abi/Vote.json');

class Vote extends React.Component {

    state = {
        address: '',
        name: '',
        contract: undefined,
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
    }

    render () {
        return (<div>
                    <p>{this.state.name}</p>
                    <p>{this.state.address}</p>
                </div>);
    }
}

export default Vote;