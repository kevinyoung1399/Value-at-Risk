import sys, os
sys.path.append(os.path.abspath(os.path.join('..', 'options_pricing')))

from options_pricing.BlackScholesMerton import BlackScholesMerton
from options_pricing.BinomialOptionPricing import BinomialOptionPricing
from options_pricing.MonteCarloOptionPricing import MonteCarloOptionPricing

def find_option_price(option, stock_price, time_to_maturity):
    """
    Price the option, based on the pricing method and its given input parameters.
    :param option: A list of lists, such that the first list within the option includes the ticker (str)
        and the approach the option will be priced (str), the second list within the option includes the parameters
        to price the option - the values vary depending on the option pricing approach, but may include the
        stock price (float), strike price (float), time to maturity (float) and so forth.
    :param stock_price: The price of the underlying stock for the option.
    :param time_to_maturity: The annual time-to-maturity of the option (measured in years)
    :return: the calculated option price.

    Author - Kevin Young
    """
    pricing_method = option[0][1]

    # stock_price = option[1][0]
    # time_to_maturity = option[1][4]

    call_or_put = option[1][0]
    strike_price = option[1][2]
    volatility = option[1][3]
    risk_free_rate = option[1][4]

    if pricing_method == 'Black Scholes Merton':
        dividend_yield = option[1][6]
        bs = BlackScholesMerton(call_or_put, stock_price, strike_price, volatility, risk_free_rate,
                                time_to_maturity,
                                dividend_yield)
        option_price = bs.calculate()
    elif pricing_method == 'Monte Carlo':
        iterations = option[1][6]
        mc = MonteCarloOptionPricing(call_or_put, stock_price, strike_price, volatility, risk_free_rate,
                                     time_to_maturity, iterations)
        option_price = mc.calculate()
    else:
        time_per_step = option[1][5]
        dividend_yield = option[1][6]
        no_of_steps = option[1][7]
        bop = BinomialOptionPricing(call_or_put, stock_price, strike_price, volatility, risk_free_rate,
                                    time_per_step, dividend_yield, no_of_steps)
        option_price = bop.calculate()
    return option_price


def calculate_percent_change(start_point, current_point):
    """
    Calculate the percentage change between a start and current point.
    :param start_point: the start point for the percent change
    :param current_point: the current point for the percent change
    :return: the percent change for the start and current point

    Author - Kevin Young
    """
    return ((float(current_point) - start_point) / abs(start_point))


