import React, { Component, Fragment } from 'react';
import axios from 'axios';

export default class App extends Component {
    state = {
        cartoons: [],
        editIndex: -1,
        editName: ""
    }

    componentDidMount() {
        axios.get('/api/cartoons').then(response => {
            const cartoons = response.data;
            const stateCartoons = [
                ...this.state.cartoons,
                ...cartoons
            ];

            this.setState({ cartoons: stateCartoons });
        });
    }

    handleCartoonNameChanged(event) {
        const newValue = event.target.value;
        this.setState({ cartoonName: newValue });
    }

    handleCreatorNameChanged(event) {
        const newValue = event.target.value;
        this.setState({ creatorName: newValue });
    }

    handleCreateNewCartoon(event) {
        event.preventDefault();
        const newCartoon = {
            name: this.state.cartoonName,
            creater: this.state.creatorName
        };

        axios.post('/api/cartoons', newCartoon).then(response => {
            const stateCartoon =  this.state.cartoons;
            console.log(response);
            this.setState({
                cartoons: [
                    ...stateCartoon,
                    response.data
                ],
                cartoonName: "",
                creatorName: ""
            });
        });
    }

    handleDeleteCartoon(cartoon) {
        axios.delete('/api/cartoons/'+cartoon.id).then(response => {
            const stateCartoons = this.state.cartoons;
            const cartoons = stateCartoons.filter(c => c.id !== cartoon.id);
            this.setState({
                cartoons: cartoons
            });
        });
    }

    handleCartoonNameEdit(event) {
        this.setState({
            editName: event.target.value
        });
    }

    handleChangeEditIndex(newIndex) {
        this.setState({
            editIndex: newIndex,
            editName: this.state.cartoons[newIndex].name
        });
    }

    handleUpdate(event) {
        event.preventDefault();
        const cartoon = this.state.cartoons[this.state.editIndex];
        cartoon.name = this.state.editName;
        axios.put('/api/cartoons/'+cartoon.id,cartoon).then( res => {
            const stateCartoons = this.state.cartoons;
            stateCartoons.splice(this.state.editIndex, 1, cartoon);
            this.setState({
                cartoons: stateCartoons,
                editIndex: -1
            });
        });
    }

    render() {
        return (
            <Fragment>
                <h2>{this.props.title}</h2>

                <form onSubmit={this.handleCreateNewCartoon.bind(this)}>
                    <input value={this.state.cartoonName} onChange={this.handleCartoonNameChanged.bind(this)} type="text" placeholder="Name of Cartoon" />
                    <input value={this.state.creatorName} onChange={this.handleCreatorNameChanged.bind(this)} type="text" placeholder="Creator" />
                    <input type="submit" value="Create" />
                </form>

                <ul>
                    {this.state.cartoons.map((cartoon, index) =>
                        <li onClick={this.handleChangeEditIndex.bind(this, index)}>
                            {this.state.editIndex === index ?
                                <form onSubmit={this.handleUpdate.bind(this)}>
                                    <input value={this.state.editName} onChange={this.handleCartoonNameEdit.bind(this)} />
                                    <input type="submit" value="Save" />
                                </form> : <Fragment>{cartoon.name} <button onClick={this.handleDeleteCartoon.bind(this, cartoon)}>Delete</button> </Fragment>
                            }
                        </li>)}
                </ul>
            </Fragment>
        );
    }
}
