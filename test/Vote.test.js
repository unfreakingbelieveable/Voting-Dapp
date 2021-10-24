const Vote = artifacts.require('Vote');

const chai = require('chai');
const assert = chai.assert;
const truffleAssert = require('truffle-assertions');
const timeMachine = require('ganache-time-traveler');

const now = Math.round(Date.now() / 1000)

contract('Vote', () => {
    let accounts;
    
    let vote;
    let result;

    const candidate1 = 'Bill Burr';
    const candidate2 = 'Larry the Cable Guy';
    const regEnd = 5;
    const voteStart = 10;
    const voteEnd = 15;

    before(async () => {
        accounts = web3.eth.getAccounts();
        vote = await Vote.new('test', now + regEnd, now + voteStart, now + voteEnd);
    });

    beforeEach(async () => {
        let snapshot = await timeMachine.takeSnapshot();
        snapshotId = snapshot['result'];
    });

    afterEach(async () => {
        await timeMachine.revertToSnapshot(snapshotId);
    })

    it('adds candidates', async () => {
        await vote.addCandidate(candidate1);
        await vote.addCandidate(candidate2);

        await truffleAssert.reverts(vote.addCandidate(candidate1), "Candidate is already entered!");

        result = await vote.getCandidates();

        assert.equal(result.length, 2);
        assert.equal(result[0], candidate1);
        assert.equal(result[1], candidate2);
    });

    it('cant register after time is up', async () => {
        await timeMachine.advanceTimeAndBlock(regEnd + 1);
        await truffleAssert.reverts(vote.addCandidate('Louis CK'), 'Registration has ended!')
    })

    it('cant vote before it starts', async () => {
        await timeMachine.advanceTimeAndBlock(voteStart - 2);
        await truffleAssert.reverts(vote.vote(candidate1), 'Voting has not started!');
    })

    it('votes for a candidate', async () => {
        await timeMachine.advanceTimeAndBlock(voteStart + 1);
        await vote.vote(candidate1);
        
        result = await vote.candidates(candidate1);
        assert.equal(result.numVotes, 1);

        await truffleAssert.reverts(vote.vote(candidate2), "You have already voted!");
    })

    it('cant vote after voting has ended', async () => {
        await timeMachine.advanceTimeAndBlock(voteEnd + 1);
        await truffleAssert.reverts(vote.vote(candidate1), 'Voting has ended!')
    })
})