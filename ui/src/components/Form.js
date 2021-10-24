import React from "react";

class Form extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.createVote}>
                <input placeholder='Poll Name' name='name' />
                <input placeholder='Registration End Time' name='regEnd' />
                <input placeholder='Voting Start Time' name='voteStart' />
                <input placeholder='Voting End Time' name='voteEnd' />
                <input type="submit" value="Create New Poll" />
            </form>
        )
    }
}

export default Form;