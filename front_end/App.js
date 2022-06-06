import React, { Component } from 'react';
import Particles from 'react-particles-js';
import HelpAndDocPopUp from './components/PopUp/HelpAndDocPopUp';
import Menu from './components/Menu/Menu';
import About from './components/About/About';
import HistoricalSimulationMenu from './components/Menu/HistoricalSimulationMenu';
import HistoricalSimulation from './components/HistoricalSimulation/HistoricalSimulation';
import HybridHistoricalSimulation from './components/HistoricalSimulation/HybridHistoricalSimulation';
import LinearModelMenu from './components/Menu/LinearModelMenu';
import LinearModel from './components/LinearModel/LinearModel';
import LinearModelCovariance from './components/LinearModel/LinearModelCovariance';
import MonteCarloMenu from './components/Menu/MonteCarloMenu';
import MonteCarlo from './components/MonteCarlo/MonteCarlo';
import MultivariateMonteCarlo from './components/MonteCarlo/MultivariateMonteCarlo';
import VolatilityMenu from './components/Menu/VolatilityMenu';
import SimpleVolatility from './components/Volatility/SimpleVolatility';
import EWMA from './components/Volatility/EWMA';
import GARCH from './components/Volatility/GARCH';
import OptionPricingMenu from './components/Menu/OptionPricingMenu';
import BinomialOptionPricing from './components/OptionPricing/BinomialOptionPricing';
import MonteCarloOptionPricing from './components/OptionPricing/MonteCarloOptionPricing';
import BlackScholesMertonOptionPricing from './components/OptionPricing/BlackScholesMertonOptionPricing';
import ModelAnalysisMenu from './components/Menu/ModelAnalysisMenu';
import BackTest from './components/ModelAnalysis/BackTest';
import StressTest from './components/ModelAnalysis/StressTest';
import EfficiencyFinder from './components/ModelAnalysis/EfficiencyFinder';
import Value from './components/Results/Value';
import Volatility from './components/Results/Volatility';
import Validity from './components/Results/Validity';
import Efficiency from './components/Results/Efficiency';
import OptionPrice from './components/Results/OptionPrice';
import ErrorPage from './components/ErrorPage/ErrorPage';
import './App.css';

const bubbles = {
"particles": {
    "number": {
      "value": 50,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 1,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "opacity_min": 0,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 4,
        "size_min": 0.3,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.2,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 600
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "bubble"
      },
      "onclick": {
        "enable": true,
        "mode": "repulse"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 250,
        "size": 0,
        "duration": 2,
        "opacity": 0,
        "speed": 3
      },
      "repulse": {
        "distance": 400,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}

/**
 * The inital state properties of the application when first opened
 */
const initialState = {
  val : -1,
  cvar : -1,
  volatility: -1,
  validity: -1,
  efficiency: -1,
  price: -1,
  route: 'menu'
}

/**
 * The App component of this React App
 * @author Kevin Young
 */
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  /**
   * Loads the value at risk and sets the value information state
   * @param {*} data - The value at risk
   */
  loadValue = (data) => {
    console.log(data)
    this.setState({
      val: data.var,
      cvar: data.cvar
    })
  }

  /**
   * Loads the volatility and sets the volatility information state
   * @param {*} data - The volatility
   */
  loadVolatility = (data) => {
    console.log(data)
    this.setState({
      volatility: data.volatility
    })
  }

  /**
   * Loads the validity and sets the validity information state
   * @param {*} data - The validity
   */
  loadValidity = (data) => {
    console.log(data)
    this.setState({
      validity: data.validity
    })
  }

  /**
   * Loads the efficiency and sets the validity information state
   * @param {*} data - The validity
   */
  loadEfficiency = (data) => {
    console.log(data)
    this.setState({
      efficiency: data.efficiency
    })
  }

  /**
   * Loads the option price and sets the validity information state
   * @param {*} data - The validity
   */
  loadOptionPrice = (data) => {
    console.log(data)
    this.setState({
      price: data.price
    })
  }


  /**
   * Handler function for navigation of pages (routes), sets the "route" state
   * @param route - The route to change to 
   */
  onRouteChange = (route) => {
    this.setState({route: route});
  }

  /* Rendering of the React app */
  render() {
    return (
      <div className="App">
        <Particles className='particles' params={bubbles} />
        <HelpAndDocPopUp />
        {/*Choose the correct page to render, depending on what route the user is in*/}
        { this.state.route === 'menu' ?
            <Menu onRouteChange={this.onRouteChange}/> 
             : this.state.route ==='about' ?
             <About onRouteChange={this.onRouteChange}/>
             : this.state.route ==='historicalSimulationMenu'?
             <HistoricalSimulationMenu onRouteChange={this.onRouteChange}/>
             : this.state.route === 'historicalSimulation' ?
             <HistoricalSimulation loadValue={this.loadValue} onRouteChange={this.onRouteChange}/>
             : this.state.route === 'hybridhistoricalSimulation' ?
             <HybridHistoricalSimulation loadValue={this.loadValue} onRouteChange={this.onRouteChange}/>  
             : this.state.route ==='linearModelMenu'?
             <LinearModelMenu onRouteChange={this.onRouteChange}/> 
             : this.state.route === 'linearModel'?
             <LinearModel loadValue={this.loadValue} onRouteChange={this.onRouteChange}/> 
             : this.state.route ==='linearModelCovariance'?
             <LinearModelCovariance loadValue={this.loadValue} onRouteChange={this.onRouteChange}/> 
             : this.state.route ==='monteCarloSimulationMenu'?
             <MonteCarloMenu onRouteChange={this.onRouteChange}/>
             : this.state.route ==='monteCarlo' ?
             <MonteCarlo loadValue={this.loadValue} onRouteChange={this.onRouteChange}/>
             : this.state.route ==='multivariateMonteCarlo' ?
             <MultivariateMonteCarlo loadValue={this.loadValue} onRouteChange={this.onRouteChange}/>  
             : this.state.route ==='volatilityMenu'?
             <VolatilityMenu onRouteChange={this.onRouteChange}/> 
             : this.state.route ==='simpleVolatility' ?
             <SimpleVolatility loadVolatility={this.loadVolatility} onRouteChange={this.onRouteChange}/> 
             : this.state.route ==='ewma' ?
             <EWMA loadVolatility={this.loadVolatility} onRouteChange={this.onRouteChange}/> 
             : this.state.route ==='garch' ?
             <GARCH loadVolatility={this.loadVolatility} onRouteChange={this.onRouteChange}/>
             : this.state.route ==='optionPricingMenu'?
             <OptionPricingMenu onRouteChange={this.onRouteChange}/>
             : this.state.route ==='binomialOptionPricing'?
             <BinomialOptionPricing loadOptionPrice={this.loadOptionPrice} onRouteChange={this.onRouteChange}/>
             : this.state.route ==='monteCarloOptionPricing'?
             <MonteCarloOptionPricing loadOptionPrice={this.loadOptionPrice} onRouteChange={this.onRouteChange}/> 
             : this.state.route ==='blackScholesMertonOptionPricing'?
             <BlackScholesMertonOptionPricing loadOptionPrice={this.loadOptionPrice} onRouteChange={this.onRouteChange}/>   
             : this.state.route ==='modelAnalysisMenu' ?
             <ModelAnalysisMenu onRouteChange={this.onRouteChange}/>
             : this.state.route ==='backTest' ?  
             <BackTest loadValidity={this.loadValidity} onRouteChange={this.onRouteChange}/>
             : this.state.route ==='stressTest' ?
             <StressTest loadValidity={this.loadValidity} onRouteChange={this.onRouteChange}/> 
             : this.state.route ==='efficiencyFinder' ?
             <EfficiencyFinder loadEfficiency={this.loadEfficiency} onRouteChange={this.onRouteChange}/>
             : this.state.route ==='volatilityResult' ?
             <Volatility volatility={this.state.volatility} onRouteChange={this.onRouteChange}/>
             : this.state.route ==='validityResult'?
             <Validity validity={this.state.validity} onRouteChange={this.onRouteChange}/>
             : this.state.route ==='efficiencyResult'?
             <Efficiency efficiency={this.state.efficiency} onRouteChange={this.onRouteChange}/>
             : this.state.route ==='optionPriceResult'?
             <OptionPrice price={this.state.price} onRouteChange={this.onRouteChange}/>
             : this.state.route ==='varResult'?
             <Value val={this.state.val} cvar={this.state.cvar}onRouteChange={this.onRouteChange}/>
             : <ErrorPage onRouteChange={this.onRouteChange}/>
            }     
      </div>
    );
  }
}

export default App;
