import React, { Component } from 'react'; 
import ReactDOM from 'react-dom'; 

class App extends Component { 
    constructor(props) { 
        super(props); 
        this.state = { 
            textareaValue: '', 
            renderedText: '' 
        }; 
        this.handleTextareaChange = this.handleTextareaChange.bind(this); 
        this.handleCorrectText = this.handleCorrectText.bind(this); 
    } 

    handleTextareaChange = (event) => { 
        this.setState({ textareaValue: event.target.value }); 
    }; 

    handleCorrectText() { 
        const url = `https://api.textgears.com/grammar?key=90MJbyJqYhQTowb8&text=${(this.state.textareaValue)}&language=pt-BR`; 

        fetch(url) 
            .then((res) => res.json()) 
            .then((data) => { 
                const errors = data["response"]["errors"]; 
                let rightText = this.state.textareaValue; 

                for (let error of errors) { 
                    let wrongWord = error["bad"]; 
                    let rightWord = error["better"][0]; 
                    rightText = this.state.textareaValue.replace(wrongWord, rightWord); 
                }   
                this.setState({ renderedText: rightText }); 
            })
            .catch((error) => console.error(error)); 
    } 

    render() { 
        return ( 
            <div> 
                <h1>Spelling Error Checker</h1> 
                <textarea 
                    rows="4" 
                    cols="50"
                    placeholder="Send text" 
                    value={this.state.textareaValue} 
                    onChange={this.handleTextareaChange} 
                ></textarea> 
                <br/> 
                <br/> 
                <button onClick={this.handleCorrectText}>Submit</button> 
                <br> 
                </br> 
                <h2>Corrected Text :</h2> 
                <p>{this.state.renderedText}</p> 
            </div> 
        ); 
    } 
} 

ReactDOM.render(<App />, document.getElementById('root')); 

export default App; 