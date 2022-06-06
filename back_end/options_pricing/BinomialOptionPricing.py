import math


class BinomialOptionPricing:
    """
    A class used for pricing European call/put options using binomial trees.
    Author - Kevin Young

    """

    def __init__(self, call_or_put, stock_price, strike_price, annual_volatility, risk_free_rate, time_per_step,
                 dividend_yield, no_of_steps):
        """
        :param call_or_put: A string stating if the given option is a 'Call' or 'Put' option.
        :param stock_price: The underlying stock price of the option.
        :param strike_price: The underlying strike price of the option.
        :param annual_volatility: the annual volatility of the option.
        :param risk_free_rate: The risk-free-rate of the option.
        :param time_per_step: The time (in years) between each step in the binomial tree.
        :param dividend_yield: The dividend of the option.
        :param no_of_steps: The number of steps in the binomial tree.
        """
        self._call_or_put = call_or_put
        self._stock_price = stock_price
        self._strike_price = strike_price
        self._annual_volatility = annual_volatility
        self._risk_free_rate = risk_free_rate
        self._time_per_step = time_per_step
        self._dividend_yield = dividend_yield
        self._no_of_steps = no_of_steps

        self._magnitude_of_up_step = 0
        self._magnitude_of_down_step = 0
        self._probability_of_up_step = 0
        self._probability_of_down_step = 0

        self._stock_tree = []
        self._option_tree = []

    def set_call_or_put(self, call_or_put):
        self._call_or_put = call_or_put

    def get_call_or_put(self):
        return self._call_or_put

    def set_stock_price(self, stock_price):
        self._stock_price = stock_price

    def get_stock_price(self):
        return self._stock_price

    def set_strike_price(self, strike_price):
        self._strike_price = strike_price

    def get_strike_price(self):
        return self._strike_price

    def set_annual_volatility(self, annual_volatility):
        self._annual_volatility = annual_volatility

    def get_annual_volatility(self):
        return self._annual_volatility

    def set_risk_free_rate(self, risk_free_rate):
        self._risk_free_rate = risk_free_rate

    def get_risk_free_rate(self):
        return self._risk_free_rate

    def set_time_per_step(self, time_per_step):
        self._time_per_step = time_per_step

    def get_time_per_step(self):
        return self._time_per_step

    def set_dividend_yield(self, dividend_yield):
        self._dividend_yield = dividend_yield

    def get_dividend_yield(self):
        return self._dividend_yield

    def set_no_of_steps(self, no_of_steps):
        self._no_of_steps = no_of_steps

    def get_no_of_steps(self):
        return self._no_of_steps

    def set_magnitude_of_up_step(self, magnitude_of_up_step):
        self._magnitude_of_up_step = magnitude_of_up_step

    def get_magnitude_of_up_step(self):
        return self._magnitude_of_up_step

    def set_magnitude_of_down_step(self, magnitude_of_down_step):
        self._magnitude_of_down_step = magnitude_of_down_step

    def get_magnitude_of_down_step(self):
        return self._magnitude_of_down_step

    def set_probability_of_up_step(self, probability_of_up_step):
        self._probability_of_up_step = probability_of_up_step

    def get_probability_of_up_step(self):
        return self._probability_of_up_step

    def set_probability_of_down_step(self, probability_of_down_step):
        self._probability_of_down_step = probability_of_down_step

    def get_probability_of_down_step(self):
        return self._probability_of_down_step

    def set_stock_tree(self, stock_tree):
        self._stock_tree = stock_tree

    def get_stock_tree(self):
        return self._stock_tree

    def set_option_tree(self, option_tree):
        self._option_tree = option_tree

    def get_option_tree(self):
        return self._option_tree

    def calculate(self):
        """
        Price the option using the binomial option pricing method.
        :return: The priced option.
        """
        self.find_parameters()
        self.create_stock_binomial_tree()
        # print(self._stock_tree)
        if self._call_or_put == 'Call':
            self.create_call_option_binomial_tree()
        else:
            self.create_put_option_binomial_tree()

        # print(self._option_tree)
        # The option price is located at the first node at the first layer of the binomial options tree.
        return round(self._option_tree[0][0], 2)

    def find_parameters(self):
        """
        Find the values of u and d, the magnitudes of the up and down steps respectively,
        as well as the values of p and 1-p, the probability of the up and down steps respectively.
        Probabilities are defined using the data on the risk-free rate, dividend yield, time per step and magnitudes
        of the up and down step.
        :return: list, the probability of the up and down steps respectively
        """
        self.find_magnitudes()
        self._probability_of_up_step = (math.exp((self._risk_free_rate - self._dividend_yield) *
                           self._time_per_step) - self._magnitude_of_down_step) / \
                  (self._magnitude_of_up_step - self._magnitude_of_down_step)
        self._probability_of_down_step = 1 - self._probability_of_up_step
        return [self._probability_of_up_step, self._probability_of_down_step]

    def find_magnitudes(self):
        """
        Find the values of u and d, the magnitudes of the up and down steps respectively,
        This is found using the annual volatility and time per step as input in the formula.
        :return: list, the magnitudes of the up and down steps respectively
        """
        self._magnitude_of_up_step = math.exp(self._annual_volatility * math.sqrt(self._time_per_step))
        self._magnitude_of_down_step = 1/self._magnitude_of_up_step
        return [self._magnitude_of_up_step, self._magnitude_of_down_step]

    def create_stock_binomial_tree(self):
        """
        Fill the binomial tree with the estimated stock prices, performing forward induction.
        :return: list : the stock binomial tree
        """
        # Insert the starting initial stock price of today in root of the tree.
        self._stock_tree.append([self._stock_price])

        for i in range (1, self._no_of_steps + 1):
            # Insert a a new layer into the tree for the number of steps input by the user.
            self._stock_tree.append([]) # access as self._stock_tree[i]
            # Here, 'last price' refers to the most previous price. 'Last' = 'most previous'
            for last_price in self._stock_tree[i - 1]:
                # If the stock tree is at it's second layer (the last layer of stock prices was the input stock data,
                # append 2 new stock prices, with an up step and down step.
                if self._stock_tree[i] == self._stock_tree[1]:
                    self._stock_tree[i].append(last_price * self._magnitude_of_down_step)
                    self._stock_tree[i].append(last_price * self._magnitude_of_up_step)
                # If the stock price in the last layer is at the most left of the tree, only add a down step in the
                # current layer, using this last stock price.
                elif last_price == self._stock_tree[i - 1][0]:
                    self._stock_tree[i].append(last_price * self._magnitude_of_down_step)
                # Otherwise, add the up and down step stock prices in the new layer based on the previous layer's
                # stock price.
                else:
                    self._stock_tree[i].append(last_price * self._magnitude_of_down_step)
                    self._stock_tree[i].append(last_price * self._magnitude_of_up_step)
        return self._stock_tree

    def create_call_option_binomial_tree(self):
        """
        Fill the binomial tree with the call option prices.
        :return: list : the option binomial tree
        """
        self._option_tree = self._stock_tree
        # First, find the option prices at the end of the tree before performing backward induction.
        for j in range(len(self._option_tree[self._no_of_steps])):
            # New price is the the stock price at the end of the option tree minus the strike price.
            new_price = self._option_tree[self._no_of_steps][j] - self._strike_price
            if new_price > 0:
                self._option_tree[self._no_of_steps][j] = new_price
            else:
                self._option_tree[self._no_of_steps][j] = 0

        return self.perform_backward_induction()

    def create_put_option_binomial_tree(self):
        """
        Fill the binomial tree with the put option prices.
        :return: list : the option binomial tree
        """
        self._option_tree = self._stock_tree
        # First, find the option prices at the end of the tree before performing backward induction.
        for j in range(len(self._option_tree[self._no_of_steps])):
            # New price is the strike price minus the stock price at the end of the option tree.
            new_price = self._strike_price - self._option_tree[self._no_of_steps][j]
            self._option_tree[self._no_of_steps][j] = max(0, new_price)
        return self.perform_backward_induction()

    def perform_backward_induction(self):
        """
        Perform backward induction on the option tree.
        :return: list : the option binomial tree
        """
        for i in range(len(self._option_tree[self._no_of_steps - 1]), 0, -1):
            for j in range(len(self._option_tree[i - 1])):
                # The price of the option, at each node, at each layer, is calculated with this following formula.
                new_price = (self._probability_of_up_step * self._option_tree[i][j + 1]
                             + (self._probability_of_down_step * self._option_tree[i][j])) * \
                            math.exp(-self._risk_free_rate * self._time_per_step)
                self._option_tree[i - 1][j] = max(0, new_price)
        return self._option_tree