import React, { Component } from 'react'; 

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
        const newValue = event.target.value;
        this.setState({ 
            textareaValue: newValue,
            renderedText: newValue === '' ? '' : this.state.renderedText 
        }); 
    }; 

    handleCorrectText() { 
        const textToCheck = this.state.textareaValue;

        fetch('https://api.languagetoolplus.com/v2/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: `text=${encodeURIComponent(textToCheck)}&language=pt-BR`
        })
            .then((res) => res.json())
            .then((data) => {
                let correctedText = this.state.textareaValue;

                if (data.matches) {
                    data.matches.forEach((match) => {
                        const wrongPart = match.context.text.substring(match.context.offset, match.context.offset + match.context.length);
                        correctedText = correctedText.replace(wrongPart, match.replacements[0].value);
                    });
                }
                correctedText = correctedText.replace(/\n/g, '<br />');

                this.setState({ renderedText: correctedText });
            })
            .catch((error) => console.log(error));
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
                <br />
                <br />
                <button onClick={this.handleCorrectText}>Submit</button>
                <br />
                <br />
                <h2>Corrected Text :</h2>
                <p dangerouslySetInnerHTML={{ __html: this.state.renderedText }}></p>
            </div>
        );
    }
}

export default App; 