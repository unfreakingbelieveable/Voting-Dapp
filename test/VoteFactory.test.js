const VoteFactory = artifacts.require('VoteFactory');
const Vote = artifacts.require('Vote');

const chai = require('chai');
const assert = chai.assert;

const now = Math.round(Date.now() / 1000)
const contract1Name = 'test1';
const contract2Name = 'test2';

contract('VoteFactory', async () => {
    let voteFactory;
    let result;
    let vote;
    let voteContracts;

    before( async () => {
        voteFactory = await VoteFactory.new();
    })

    it('creates new contracts', async () => {
        result = await voteFactory.addVote(contract1Name, now + (5), now + (10), now + (15));
        result = await voteFactory.getVotes();
        assert.equal(result.length, 1);

        await voteFactory.addVote(contract2Name, now + (5), now + (10), now + (15));
        result = await voteFactory.getVotes()
        assert.equal(result.length, 2);

        voteContracts = result;
    })

    it('checks names of deployed contracts', async () => {
        vote = await Vote.at(voteContracts[0]);
        result = await vote.name();
        assert.equal(result, contract1Name)

        vote = await Vote.at(voteContracts[1]);
        result = await vote.name();
        assert.equal(result, contract2Name)
    })
})