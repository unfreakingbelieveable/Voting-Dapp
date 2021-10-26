import React from "react";

class Form extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.createVote}>
                <input placeholder='Poll Name' name='name' required/>
                <input type='datetime-local' name='regEnd' required/>
                <input type='datetime-local' name='voteStart' required/>
                <input type='datetime-local' name='voteEnd' required/>
                <input type="submit" value="Create New Poll" />
            </form>
        )
    }
}

export default Form;