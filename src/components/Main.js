import React, { Component } from 'react'
import BuyForm from './BuyForm'

class Main extends Component {

  constructor(props){
super(props)
this.state ={
  currentForm: 'buy'
}
}

  
  render() {
    let content
    if(this.state.currentForm === 'buy') {
      content = <BuyForm
        etherBalance={this.props.etherBalance}
        tokenBalance={this.props.tokenBalance}
        buyTokens={this.props.buyTokens}
      />
    }
    return (
      <div id="content" className="mt-3">

 <div className="card mb-4" >

<div className="card-body">

{content}
      </div>

    </div>    
 </div>
    );
  }
}

export default Main;