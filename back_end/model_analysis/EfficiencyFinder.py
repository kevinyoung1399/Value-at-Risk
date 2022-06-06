import yfinance as yf
import sys, os
sys.path.append(os.path.abspath(os.path.join('..', 'helpers')))

from helpers.Helpers import find_option_price
from helpers.Helpers import calculate_percent_change


class EfficiencyFinder:
    """
    A class used for finding the efficiency of a calculated value at risk using historical data using scoring rules.
    Author - Kevin Young

    """

    def __init__(self, value_at_risk, stock_input_data, option_input_data, confidence_level, n, scenario_number):
        """
        :param value_at_risk: The calculated value-at risk to be tested on.
        :param stock_input_data: A list such that each element in the list contains first, the asset the particular
        stock will be back-tested on (in ticker format) and second, the amount of that specific stock.
        :param option_input_data:  options: A list such that for every option,
        the first list within the option includes an asset (in ticker format) the option will be tested on,
        and the approach the option will be priced (str), the second list within the option includes the parameters
        to price the option - the values vary depending on the option pricing approach, but may include the
        stock price (float), strike price (float), time to maturity (float) and so forth.
        :param confidence_level: The confidence level used in the calculated value at risk.
        :param n: The time horizon used for calculating Var (in days).
        :param scenario_number: The number of scenarios to be generated in the simulation.
        """
        self._value_at_risk = value_at_risk
        self._stock_input_data = stock_input_data
        self._option_input_data = option_input_data
        self._confidence_level = confidence_level
        self._n = n
        self._scenario_number = scenario_number
        self._percentage_changes_by_asset = []
        self._losses_of_portfolio = []

    def set_value_at_risk(self, value_at_risk):
        self._value_at_risk = value_at_risk

    def get_value_at_risk(self):
        return self._value_at_risk

    def set_stock_input_data(self, stock_input_data):
        self._stock_input_data = stock_input_data

    def get_stock_input_data(self):
        return self._stock_input_data

    def set_option_input_data(self, option_input_data):
        self._option_input_data = option_input_data

    def set_confidence_level(self, confidence_level):
        self._confidence_level = confidence_level

    def get_confidence_level(self):
        return self._confidence_level

    def set_n(self, n):
        self._n = n

    def get_n(self):
        return self._n

    def set_percentage_changes_by_asset(self, percentage_changes_by_asset):
        self._percentage_changes_by_asset = percentage_changes_by_asset

    def get_percentage_changes_by_asset(self):
        return self._percentage_changes_by_asset

    def set_losses_of_portfolio(self, losses_of_portfolio):
        self._losses_of_portfolio = losses_of_portfolio

    def get_losses_of_portfolio(self):
        return self._losses_of_portfolio

    def calculate(self):
        """
        Calculate the efficiency of an approach with scoring rules.
        :return: The calculated efficiency.
            The first value is the cumulative value for the efficiency.
            The second value is the average value for the fficiency.
        """
        # get the scenarios for each asset in the portfolio
        # add the changes from each asset together
        for i in range(len(self._stock_input_data)):
            if i is 0:
                self._losses_of_portfolio = self.find_losses(self._stock_input_data[i])
            else:
                changes_on_new_stock = self.find_losses(self._stock_input_data[i])
                self._losses_of_portfolio = [a + b for a, b in zip(self._losses_of_portfolio, changes_on_new_stock)]

        # Generate the losses of the option price and include them in the total loss of the portfolio.
        for asset in self._option_input_data:
            option_losses_for_asset = self.generate_option_losses(asset)
            # print('option losses for asset', option_losses_for_asset)
            self._losses_of_portfolio = [a + b for a, b in zip(self._losses_of_portfolio, option_losses_for_asset)]

        cumulative_value = 0
        for loss in self._losses_of_portfolio:
            # print('X:', loss)
            cumulative_value += self.scoring_rule(loss)

        average_value = cumulative_value / len(self._losses_of_portfolio)
        # Return the cumulative efficiency value as the first element, and the average value as the second.
        return [cumulative_value, average_value]

    def scoring_rule(self, loss):
        """
        Calculate the effiency of the approach using the scoring rules
        :param loss:
        :return: A value measuring the efficiency of the approach. A score of 0 means the model is perfectly
        efficient, i.e the VaR is as close to the 'actual' losses as possible. The lower the value, the more efficient.
        """

        if loss <= self._value_at_risk:
            return (1 - self._confidence_level) * (self._value_at_risk - loss)
        # Otherwise if actual loss > value at risk...
        return self._confidence_level * (loss - self._value_at_risk)

    def find_losses(self, stock):
        """
        Generate the 'actual' losses by multiplying the percentage changes with the values of the stock.
        :param stock: A stock in the portfolio.
        :return: A list of losses for that particular stock.
        """
        value = stock[1]
        percentage_changes = self.find_changes(stock[0])

        # Calculate the losses by multiplying the percentage changes with the value of the stock.
        # This will give us 500 scenarios, with 500 losses. Negative losses represent a gain
        # (an increase in stock value)
        losses = []
        for i in range(len(percentage_changes)):
            losses.append(percentage_changes[i] * value * - 1)

        return losses

    def find_changes(self, asset_name):
        """
        Calculate close changes between days and previous days of the stock using the given extreme historical data
        and generate the scenarios.
        :param asset_name: The name of the given asset.
        :return: The list of percentage changes for the given asset.
        """

        # Get the ticker of the given asset from Yahoo Finance
        ticker = yf.Ticker(asset_name)

        # Receive historical data from the ticker
        historical_data = ticker.history(period = "max")

        # Collect the 501 most recent items from the historical dataset
        tail_data= historical_data.tail(self._scenario_number + 1)

        # Use the 'Close' column to calculate the percentage changes between day i and i-1
        close = tail_data['Close']

        # Create a list of all the percentage changes
        percentage_changes = []
        for i in range(1, len(close)):
            percentage_changes.append(calculate_percent_change(close[i], close[i-1]))
        # print('percentage changes:', percentage_changes)

        # Save the percentage changes (for later use in option pricing)
        self._percentage_changes_by_asset = [asset_name, percentage_changes]
        # print('percentage changes by asset', self._percentage_changes_by_asset)

        return percentage_changes

    def generate_option_losses(self, option):
        """
        Generate the losses from the given option, using the current and new stock prices and
        times to maturity as input variables to price the options.
        :param option: The option of the portfolio, containing information about the option and how it will be priced.
        :return: The option losses.
        """
        stock_price_today = option[1][1]
        time_to_maturity_today = option[1][5]
        option_price_today = find_option_price(option, stock_price_today, time_to_maturity_today)

        # Find the generated stock amounts of the asset that corresponds to the given option
        asset_name_for_option = option[0][0]
        new_stock_prices = []

        asset_found = False
        for asset in self._percentage_changes_by_asset:
            if asset[0] == asset_name_for_option:
                # Generate new stock prices today based on the effect of the generated
                # percentage changes on today's price
                for percentage_change in asset[1]:
                    new_stock_prices.append(stock_price_today + percentage_change * stock_price_today)
                asset_found = True

        if asset_found is False:
            # Generate the stock amounts for the new asset
            percentage_changes = self.find_changes(asset_name_for_option)
            for percentage_change in percentage_changes:
                new_stock_prices.append(stock_price_today + percentage_change * stock_price_today)

        # print('new stock prices', new_stock_prices)

        # Update the time to maturity, as after N days, the date will change, so the option will be closer to expiring.
        # N is in days and time to maturity is in years, so convert the number of days to number of years.
        new_time_to_maturity = time_to_maturity_today - (self._n / 365)

        # Generate new option prices based on the stock amounts
        new_option_prices = []
        for new_stock_price in new_stock_prices:
            new_option_prices.append(find_option_price(option, new_stock_price, new_time_to_maturity))
        # print('new option prices', new_option_prices)

        # Generate option losses by subtracting today's option price with the new option price.
        option_losses = []
        for new_option_price in new_option_prices:
            option_losses.append(option_price_today - new_option_price)
        # print('option losses', option_losses)

        return option_losses