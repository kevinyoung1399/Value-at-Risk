from flask import Flask, jsonify, request, abort
from flask_cors import CORS

import yfinance as yf

from classical_models.HistoricalSimulation import HistoricalSimulation
from classical_models.HybridHistoricalSimulation import HybridHistoricalSimulation
from classical_models.LinearModel import LinearModel
from classical_models.MonteCarloBrownianMotion import MonteCarloBrownianMotion
from classical_models.MultivariateMonteCarlo import MultivariateMonteCarlo
from conditional_var.ConditionalVaR import ConditionalVaR
from model_analysis.BackTest import BackTest
from model_analysis.StressTest import StressTest
from model_analysis.EfficiencyFinder import EfficiencyFinder
from options_pricing.BinomialOptionPricing import BinomialOptionPricing
from options_pricing.MonteCarloOptionPricing import MonteCarloOptionPricing
from options_pricing.BlackScholesMerton import BlackScholesMerton
from volatility_estimator.VolatilityEstimator import VolatilityEstimator

""" Author - Kevin Young"""


def checkValidTicker(asset):
    """
    Check if the input asset from the front end is recognisable by Yahoo Finance.
    """
    ticker = yf.Ticker(asset)
    if ticker.info == {} :
        return False
    return True
    

""" server.py acts as a controller for the program by recieving data from the
view, passing it to the model (the VaR approaches) and to return a value back
to the view"""

"""Setting up of the Flask Application"""
app = Flask(__name__)
CORS(app)

""" Return some text to check if the server is running"""
@app.route('/')
def index():
    return "The server is a go!!!"


@app.route('/historicalsimulation', methods=['POST'], endpoint='historicalsimulation')
def handleHistoricalSimulation():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    calculate the value at risk (VaR) using historical simulation, pass the data to
    the model, the Historical Simulation class, to calculate the VaR and return the
    answer
    Returns
    -------
    float
        The value at risk calculated by historical simulation.
    """
    if not request.json or not 'inputStocks' in request.json or not 'inputOptions' in request.json or not \
    'confidenceLevel' in request.json or not 'N' in request.json or not 'scenarioNumber' in request.json:
        abort(400, 'your requests are invalid, please try again.')
    inputs = {

        'inputStocks':request.json['inputStocks'],
        'inputOptions':request.json['inputOptions'],
        'confidenceLevel': request.json['confidenceLevel'],
        'N' : request.json['N'],
        'scenarioNumber': request.json['scenarioNumber']
    }

    # Check if the stocks ticker symbol is recognisable by YFinance
    for stock in inputs['inputStocks']:
        if checkValidTicker(stock[0]) is False:
            print('this stock', stock[0], 'is not valid')
            abort(400, 'invalid stock ticker symbol')
        else :
            print ('stock is good.')
    # Check if the options ticker symbol is recognisable by YFinance
    for option in inputs['inputOptions']:
        if checkValidTicker(option[0][0]) is False:
            print('this option', option[0][0], 'is not valid')
            abort(400, 'invalid option ticker symbol')
        else :
            print ('option is good.')

    parameters = [inputs['inputStocks'], inputs['inputOptions'],
        inputs['confidenceLevel'], inputs['N'], inputs['scenarioNumber']]

    approach = ConditionalVaR('Historical Simulation', parameters)

    values = approach.calculate()

    VaR = values[0]
    CVaR = values[1]

    return jsonify({'var': VaR, 'cvar':CVaR}), 201

@app.route('/hybridhistoricalsimulation', methods=['POST'], endpoint='hybridhistoricalsimulation')
def handleHybridHistoricalSimulation():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    calculate the value at risk (VaR) using hybrid historical simulation, pass the data to
    the model, the Hybrid Historical Simulation class, to calculate the VaR and return the
    answer
    Returns
    -------
    float
        The value at risk calculated by hybrid historical simulation.
    """
    if not request.json or not 'inputStocks' in request.json or not 'inputOptions' in request.json or not \
    'confidenceLevel' in request.json or not 'N' in request.json or not 'scenarioNumber' in request.json or not\
    'weight' in request.json:
        abort(400, 'your requests are invalid, please try again.')
    inputs = {

        'inputStocks':request.json['inputStocks'],
        'inputOptions':request.json['inputOptions'],
        'confidenceLevel': request.json['confidenceLevel'],
        'N' : request.json['N'],
        'scenarioNumber': request.json['scenarioNumber'],
        'weight': request.json['weight']
    }

    # Check if the stocks ticker symbol is recognisable by YFinance
    for stock in inputs['inputStocks']:
        if checkValidTicker(stock[0]) is False:
            print('this stock', stock[0], 'is not valid')
            abort(400, 'invalid stock ticker symbol')
        else :
            print ('stock is good.')
    # Check if the options ticker symbol is recognisable by YFinance
    for option in inputs['inputOptions']:
        if checkValidTicker(option[0][0]) is False:
            print('this option', option[0][0], 'is not valid')
            abort(400, 'invalid option ticker symbol')
        else :
            print ('option is good.')

    parameters = [inputs['inputStocks'], inputs['inputOptions'],
        inputs['confidenceLevel'], inputs['N'], inputs['scenarioNumber'],
        inputs['weight']]


    approach = ConditionalVaR('Hybrid Historical Simulation', parameters)

    values = approach.calculate()

    VaR = values[0]
    CVaR = values[1]

    return jsonify({'var': VaR, 'cvar':CVaR}), 201

@app.route('/montecarlo', methods=['POST'], endpoint='montecarlo')
def handleMonteCarlo():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    calculate the value at risk (VaR) using hybrid historical simulation, pass the data to
    the model, the Monte Carlo Simulation class, to calculate the VaR and return the
    answer
    Returns
    -------
    float
        The value at risk calculated by monte carlo simulation with brownian motion.
    """
    if not request.json or not 'inputStocks' in request.json or not 'inputOptions' in request.json or not \
    'confidenceLevel' in request.json or not 'N' in request.json or not 'scenarioNumber' in request.json or not \
    'dailyDrift' in request.json:
        abort(400, 'your requests are invalid, please try again.')
    inputs = {

        'inputStocks':request.json['inputStocks'],
        'inputOptions':request.json['inputOptions'],
        'confidenceLevel': request.json['confidenceLevel'],
        'N' : request.json['N'],
        'scenarioNumber': request.json['scenarioNumber'],
        'dailyDrift': request.json['dailyDrift']
    }

    # Check if the stocks ticker symbol is recognisable by YFinance
    for stock in inputs['inputStocks']:
        if checkValidTicker(stock[0]) is False:
            print('this stock', stock[0], 'is not valid')
            abort(400, 'invalid stock ticker symbol')
        else :
            print ('stock is good.')
    # Check if the options ticker symbol is recognisable by YFinance
    for option in inputs['inputOptions']:
        if checkValidTicker(option[0][0]) is False:
            print('this option', option[0][0], 'is not valid')
            abort(400, 'invalid option ticker symbol')
        else :
            print(option[0][0])
            print ('option is good.')

    parameters = [inputs['inputStocks'], inputs['inputOptions'],
        inputs['confidenceLevel'], inputs['N'], inputs['scenarioNumber'],
        inputs['dailyDrift']]

    print('parameters', parameters)


    approach = ConditionalVaR('Monte Carlo Brownian Motion', parameters)

    values = approach.calculate()

    VaR = values[0]
    CVaR = values[1]

    return jsonify({'var': VaR, 'cvar':CVaR}), 201

@app.route('/multivariatemontecarlo', methods=['POST'], endpoint='multivariatemontecarlo')
def handleMultivariateMonteCarlo():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    calculate the value at risk (VaR) using hybrid historical simulation, pass the data to
    the model, the Multivariate Monte Carlo simulation class, to calculate the VaR and return the
    answer
    Returns
    -------
    float
        The value at risk calculated by Multivariate Monte Carlo simulation.
    """
    if not request.json or not 'inputStocks' in request.json or not 'inputOptions' in request.json or not \
    'confidenceLevel' in request.json or not 'N' in request.json or not 'scenarioNumber' in request.json:
        abort(400, 'your requests are invalid, please try again.')
    inputs = {

        'inputStocks':request.json['inputStocks'],
        'inputOptions':request.json['inputOptions'],
        'confidenceLevel': request.json['confidenceLevel'],
        'N' : request.json['N'],
        'scenarioNumber': request.json['scenarioNumber']
    }

    # Check if the stocks ticker symbol is recognisable by YFinance
    for stock in inputs['inputStocks']:
        if checkValidTicker(stock[0]) is False:
            print('this stock', stock[0], 'is not valid')
            abort(400, 'invalid stock ticker symbol')
        else :
            print ('stock is good.')
    # Check if the options ticker symbol is recognisable by YFinance
    for option in inputs['inputOptions']:
        if checkValidTicker(option[0][0]) is False:
            print('this option', option[0][0], 'is not valid')
            abort(400, 'invalid option ticker symbol')
        else :
            print(option[0][0])
            print ('option is good.')

    parameters = [inputs['inputStocks'], inputs['inputOptions'],
        inputs['confidenceLevel'], inputs['N'], inputs['scenarioNumber']]

    print('parameters', parameters)


    approach = ConditionalVaR('Multivariate Monte Carlo', parameters)

    values = approach.calculate()

    VaR = values[0]
    CVaR = values[1]

    return jsonify({'var': VaR, 'cvar':CVaR}), 201

@app.route('/linearmodel', methods=['POST'], endpoint='linearmodel')
def handleLinearModel():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    calculate the value at risk (VaR) using hybrid historical simulation, pass the data to
    the model, the LinearModel class, to calculate the VaR and return the
    answer
    Returns
    -------
    float
        The value at risk calculated by the LinearModel.
    """
    if not request.json or not 'inputStocks' in request.json or not \
    'confidenceLevel' in request.json or not 'N' in request.json:
        abort(400, 'your requests are invalid, please try again.')
    inputs = {

        'inputStocks':request.json['inputStocks'],
        'confidenceLevel': request.json['confidenceLevel'],
        'N' : request.json['N']
    }

    # Check if the stocks ticker symbol is recognisable by YFinance
    for stock in inputs['inputStocks']:
        if checkValidTicker(stock[0]) is False:
            print('this stock', stock[0], 'is not valid')
            abort(400, 'invalid stock ticker symbol')
        else :
            print ('stock is good.')

    approach = LinearModel(inputs['inputStocks'], inputs['confidenceLevel'], inputs['N'])

    VaR = approach.calculate()

    return jsonify({'var': VaR}), 201

@app.route('/linearmodelcovariance', methods=['POST'], endpoint='linearmodelcovariance')
def handleLinearModelCovariance():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    calculate the value at risk (VaR) using hybrid historical simulation, pass the data to
    the model, the LinearModel class, to calculate the VaR and return the
    answer
    Returns
    -------
    float
        The value at risk calculated by the LinearModel.
    """
    if not request.json or not 'inputStocks' in request.json or not \
    'confidenceLevel' in request.json or not 'N' in request.json:
        abort(400, 'your requests are invalid, please try again.')
    inputs = {

        'inputStocks':request.json['inputStocks'],
        'confidenceLevel': request.json['confidenceLevel'],
        'N' : request.json['N']
    }

    # Check if the stocks ticker symbol is recognisable by YFinance
    for stock in inputs['inputStocks']:
        if checkValidTicker(stock[0]) is False:
            print('this stock', stock[0], 'is not valid')
            abort(400, 'invalid stock ticker symbol')
        else :
            print ('stock is good.')

    approach = LinearModel(inputs['inputStocks'], inputs['confidenceLevel'], inputs['N'])

    VaR = approach.calculate_with_covariance()

    return jsonify({'var': VaR}), 201

@app.route('/backtest', methods=['POST'], endpoint='backtest')
def handleBackTest():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    calculate the validity of a VaR with back-testing, pass the data to
    the model, the BackTest class, to calculate the validity and return the
    answer
    Returns
    -------
    float
        The validity of the VaR with back-testing.
    """
    if not request.json or not 'valueAtRisk' in request.json or not 'inputStocks' in request.json or not \
    'inputOptions' in request.json or not 'N' in request.json or not 'scenarioNumber' in request.json:
        abort(400, 'your requests are invalid, please try again.')
    inputs = {
        'valueAtRisk':request.json['valueAtRisk'], 
        'inputStocks':request.json['inputStocks'],
        'inputOptions':request.json['inputOptions'],
        'N' : request.json['N'],
        'scenarioNumber': request.json['scenarioNumber']
    }

    # Check if the stocks ticker symbol is recognisable by YFinance
    for stock in inputs['inputStocks']:
        if checkValidTicker(stock[0]) is False:
            print('this stock', stock[0], 'is not valid')
            abort(400, 'invalid stock ticker symbol')
        else :
            print ('stock is good.')
    # Check if the options ticker symbol is recognisable by YFinance
    for option in inputs['inputOptions']:
        if checkValidTicker(option[0][0]) is False:
            print('this option', option[0][0], 'is not valid')
            abort(400, 'invalid option ticker symbol')
        else :
            print ('option is good.')

    testing = BackTest(inputs['valueAtRisk'], inputs['inputStocks'], 
        inputs['inputOptions'], inputs['N'], inputs['scenarioNumber'])

    validity = testing.calculate()

    return jsonify({'validity': validity}), 201

@app.route('/stresstest', methods=['POST'], endpoint='stresstest')
def handleStressTest():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    calculate the validity of a VaR with stress-testing, pass the data to
    the model, the BackTest class, to calculate the validity and return the
    answer
    Returns
    -------
    float
        The validity of the VaR with stress-testing.
    """
    if not request.json or not 'valueAtRisk' in request.json or not 'inputStocks' in request.json or not \
    'inputOptions' in request.json or not 'N' in request.json or not 'startDate' in request.json or not \
    'endDate' in request.json:
        abort(400, 'your requests are invalid, please try again.')
    inputs = {
        'valueAtRisk':request.json['valueAtRisk'], 
        'inputStocks':request.json['inputStocks'],
        'inputOptions':request.json['inputOptions'],
        'N' : request.json['N'],
        'startDate': request.json['startDate'],
        'endDate': request.json['endDate']
    }

    # Check if the stocks ticker symbol is recognisable by YFinance
    for stock in inputs['inputStocks']:
        if checkValidTicker(stock[0]) is False:
            print('this stock', stock[0], 'is not valid')
            abort(400, 'invalid stock ticker symbol')
        else :
            print ('stock is good.')
    # Check if the options ticker symbol is recognisable by YFinance
    for option in inputs['inputOptions']:
        if checkValidTicker(option[0][0]) is False:
            print('this option', option[0][0], 'is not valid')
            abort(400, 'invalid option ticker symbol')
        else :
            print ('option is good.')

    testing = StressTest(inputs['valueAtRisk'], inputs['inputStocks'], 
        inputs['inputOptions'], inputs['N'], inputs['startDate'], inputs['endDate'])

    validity = testing.calculate()

    return jsonify({'validity': validity}), 201

@app.route('/efficiencyfinder', methods=['POST'], endpoint='efficiencyfinder')
def handleEfficiencyFinder():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    calculate the efficiency of a VaR with scoring rules, pass the data to
    the model, the BackTest class, to calculate the efficiency and return the
    answer
    Returns
    -------
    float
        The efficiency of the VaR with scoring rules.
    """
    if not request.json or not 'valueAtRisk' in request.json or not 'inputStocks' in request.json or not \
    'inputOptions' in request.json or not 'confidenceLevel' in request.json or not 'N' in request.json or not\
     'scenarioNumber' in request.json:
        abort(400, 'your requests are invalid, please try again.')
    inputs = {
        'valueAtRisk':request.json['valueAtRisk'], 
        'inputStocks':request.json['inputStocks'],
        'inputOptions':request.json['inputOptions'],
        'confidenceLevel':request.json['confidenceLevel'],
        'N' : request.json['N'],
        'scenarioNumber': request.json['scenarioNumber']
    }

    # Check if the stocks ticker symbol is recognisable by YFinance
    for stock in inputs['inputStocks']:
        if checkValidTicker(stock[0]) is False:
            print('this stock', stock[0], 'is not valid')
            abort(400, 'invalid stock ticker symbol')
        else :
            print ('stock is good.')
    # Check if the options ticker symbol is recognisable by YFinance
    for option in inputs['inputOptions']:
        if checkValidTicker(option[0][0]) is False:
            print('this option', option[0][0], 'is not valid')
            abort(400, 'invalid option ticker symbol')
        else :
            print ('option is good.')

    testing = EfficiencyFinder(inputs['valueAtRisk'], inputs['inputStocks'], 
        inputs['inputOptions'], inputs['confidenceLevel'],
        inputs['N'], inputs['scenarioNumber'])

    efficiency = testing.calculate()

    return jsonify({'efficiency': efficiency}), 201

@app.route('/binomialoptionpricing', methods=['POST'], endpoint='binomialoptionpricing')
def handleBinomialOptionPricing():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    price an option with binomial trees, pass the data to
    the model, the BinomialOptionPricing class, to price the option and return the
    answer
    Returns
    -------
    float
        The calculated price of the option.
    """
    if not request.json or not 'optionType' in request.json or not 'stockPrice' in request.json or not \
    'strikePrice' in request.json or not 'volatility' in request.json or not 'riskFreeRate' in request.json or not\
     'timePerStep' in request.json or not 'dividendYield' in request.json or not 'numberOfSteps' in request.json:
        abort(400, 'your requests are invalid, please try again.')
    inputs = {
        'optionType':request.json['optionType'], 
        'stockPrice':request.json['stockPrice'],
        'strikePrice':request.json['strikePrice'],
        'volatility':request.json['volatility'],
        'riskFreeRate' : request.json['riskFreeRate'],
        'timePerStep': request.json['timePerStep'],
        'dividendYield': request.json['dividendYield'],
        'numberOfSteps': request.json['numberOfSteps']
    }

    pricing = BinomialOptionPricing(inputs['optionType'].capitalize(), inputs['stockPrice'], 
        inputs['strikePrice'], inputs['volatility'],
        inputs['riskFreeRate'], inputs['timePerStep'],
        inputs['dividendYield'], inputs['numberOfSteps'])

    efficiency = pricing.calculate()

    return jsonify({'price': efficiency}), 201

@app.route('/montecarlooptionpricing', methods=['POST'], endpoint='montecarlooptionpricing')
def handleMonteCarloOptionPricing():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    price an option with monte carlo simulation, pass the data to
    the model, the MonteCarloOptionPricing class, to price the option and return the
    answer
    Returns
    -------
    float
        The calculated price of the option.
    """
    if not request.json or not 'optionType' in request.json or not 'stockPrice' in request.json or not \
    'strikePrice' in request.json or not 'volatility' in request.json or not 'riskFreeRate' in request.json or not\
     'timeToMaturity' in request.json or not 'iterations' in request.json:
        abort(400, 'your requests are invalid, please try again.')
    inputs = {
        'optionType':request.json['optionType'], 
        'stockPrice':request.json['stockPrice'],
        'strikePrice':request.json['strikePrice'],
        'volatility':request.json['volatility'],
        'riskFreeRate' : request.json['riskFreeRate'],
        'timeToMaturity': request.json['timeToMaturity'],
        'iterations': request.json['iterations']
    }

    pricing = MonteCarloOptionPricing(inputs['optionType'].capitalize(), inputs['stockPrice'], 
        inputs['strikePrice'], inputs['volatility'],
        inputs['riskFreeRate'], inputs['timeToMaturity'],
        inputs['iterations'])

    efficiency = pricing.calculate()

    return jsonify({'price': efficiency}), 201

@app.route('/blackscholesmertonoptionpricing', methods=['POST'], endpoint='blackscholesmertonoptionpricing')
def handleBlackScholesMertonOptionPricing():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    price an option with the Black Scholes Merton model, pass the data to
    the model, the BlackScholesMerton class, to price the option and return the
    answer
    Returns
    -------
    float
        The calculated price of the option.
    """
    if not request.json or not 'optionType' in request.json or not 'stockPrice' in request.json or not \
    'strikePrice' in request.json or not 'volatility' in request.json or not 'riskFreeRate' in request.json or not\
     'timeToMaturity' in request.json or not 'dividendYield' in request.json:
        abort(400, 'your requests are invalid, please try again.')
    inputs = {
        'optionType':request.json['optionType'], 
        'stockPrice':request.json['stockPrice'],
        'strikePrice':request.json['strikePrice'],
        'volatility':request.json['volatility'],
        'riskFreeRate' : request.json['riskFreeRate'],
        'timeToMaturity': request.json['timeToMaturity'],
        'dividendYield': request.json['dividendYield']
    }

    pricing = BlackScholesMerton(inputs['optionType'].capitalize(), inputs['stockPrice'], 
        inputs['strikePrice'], inputs['volatility'],
        inputs['riskFreeRate'], inputs['timeToMaturity'],
        inputs['dividendYield'])

    efficiency = pricing.calculate()

    return jsonify({'price': efficiency}), 201

@app.route('/simplevolatility', methods=['POST'], endpoint='simplevolatility')
def handleSimpleVolatility():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    estimate the volatility using simple volatility, pass the data to
    the model, the Volatility Estimator class, to calculate the volatility and return the
    answer

    Returns
    -------
    float
        The volatility estimated by the standard formula.
    """
    if not request.json or not 'asset' in request.json or not 'numberOfDays' in request.json:
        abort(400, 'your requests are invalid, please try again.')

    inputs = {
        'asset': request.json['asset'],
        'numberOfDays': request.json['numberOfDays']
    }
    # Check if the asset ticker symbol is recognisable by YFinance
    if checkValidTicker(inputs['asset']) is False:
        print('this stock', stock[0], 'is not valid')
        abort(400, 'invalid stock ticker symbol')
    else :
        print ('asset is good.')
    
    estimator = VolatilityEstimator(inputs['asset'], inputs['numberOfDays'], 
        0, 0, 0)

    volatility = estimator.simple_volatility()

    return jsonify({'volatility': volatility}), 201

@app.route('/ewma', methods=['POST'], endpoint='ewma')
def handleEWMA():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    estimate the volatility using EWMA, pass the data to
    the model, the Volatility Estimator class, to calculate the volatility and return the
    answer

    Returns
    -------
    float
        The volatility estimated by EWMA.
    """
    if not request.json or not 'asset' in request.json or not 'numberOfDays' in request.json:
        abort(400, 'your requests are invalid, please try again.')

    inputs = {
        'asset': request.json['asset'],
        'numberOfDays': request.json['numberOfDays']
    }
    # Check if the asset ticker symbol is recognisable by YFinance
    if checkValidTicker(inputs['asset']) is False:
        print('this stock', stock[0], 'is not valid')
        abort(400, 'invalid stock ticker symbol')
    else :
        print ('asset is good.')
    
    estimator = VolatilityEstimator(inputs['asset'], inputs['numberOfDays'], 
        0, 0, 0)

    volatility = estimator.ewma()

    return jsonify({'volatility': volatility}), 201

@app.route('/garch', methods=['POST'], endpoint='garch')
def handleGARCH():
    """Proccessing of an incoming POST request to deal recieved data to be used to
    estimate the volatility using GARCH(1, 1), pass the data to
    the model, the Volatility Estimator class, to calculate the volatility and return the
    answer

    Returns
    -------
    float
        The volatility estimated by EWMA.
    """
    if not request.json or not 'asset' in request.json or not 'numberOfDays' in request.json or not\
     'gamma' in request.json or not 'alpha' in request.json or not 'beta' in request.json:
        abort(400, 'your requests are invalid, please try again.')

    inputs = {
        'asset': request.json['asset'],
        'numberOfDays': request.json['numberOfDays'],
        'gamma' : request.json['gamma'],
        'alpha' : request.json['alpha'],
        'beta' : request.json['beta']
    }
    # Check if the asset ticker symbol is recognisable by YFinance
    if checkValidTicker(inputs['asset']) is False:
        print('this stock', stock[0], 'is not valid')
        abort(400, 'invalid stock ticker symbol')
    else :
        print ('asset is good.')
    
    estimator = VolatilityEstimator(inputs['asset'], inputs['numberOfDays'], 
        inputs['gamma'], inputs['alpha'], inputs['beta'])

    volatility = estimator.garch()

    return jsonify({'volatility': volatility}), 201

if __name__ == '__main__':
    app.run(debug=True)


