import sys, os
sys.path.append(os.path.abspath(os.path.join('..', 'classical_models')))

from classical_models.HistoricalSimulation import HistoricalSimulation
from classical_models.HybridHistoricalSimulation import HybridHistoricalSimulation
from classical_models.MonteCarloBrownianMotion import MonteCarloBrownianMotion
from classical_models.MultivariateMonteCarlo import MultivariateMonteCarlo


class ConditionalVaR:
    """
    A class used to calculate the conditional value at risk.
    Author - Kevin Young
    """

    def __init__(self, var_type, var_parameters):
        """
        :param var_type: The approach the the value at risk will be calculated in.
        :param var_parameters: The parameters to be input for the given approach.
        """
        self._var_type = var_type
        self._var_parameters = var_parameters
        self._losses_of_portfolio = []
        self._percentile_location = 0
        self._var = 0

    def set_var_type(self, var_type):
        self._var_type = var_type

    def get_var_type(self):
        return self._var_type

    def set_var_parameters(self, var_parameters):
        self._var_parameters = var_parameters

    def get_var_parameters(self):
        return self._var_parameters

    def set_losses_of_portfolio(self, losses_of_portfolio):
        self._losses_of_portfolio = losses_of_portfolio

    def get_losses_of_portfolio(self):
        return self._losses_of_portfolio

    def set_percentile_location(self, percentile_location):
        self._percentile_location = percentile_location

    def get_percentile_location(self):
        return self._percentile_location

    def set_var(self, var):
        self._var = var

    def get_var(self):
        return self._var

    def calculate(self):
        """
        Calculate the VaR and find the losses based on the given VaR approach, then calculate the CVaR  based on the
        VaR and the losses.
        :return: A list containing the VaR as the first item and the CVaR as the second.
        """

        # All classical approaches have such following parameters in common.
        stocks = self._var_parameters[0]
        options = self._var_parameters[1]
        confidence_level = self._var_parameters[2]
        n = self._var_parameters[3]
        scenario_number = self._var_parameters[4]

        if self._var_type == 'Historical Simulation':
            hs = HistoricalSimulation(stocks, options, confidence_level, n, scenario_number)
            self._var = hs.calculate()
            self._losses_of_portfolio = hs.get_losses_of_portfolio()
            self._percentile_location = hs.get_percentile_location()
        elif self._var_type == 'Hybrid Historical Simulation':
            weight = self._var_parameters[5]
            hhs = HybridHistoricalSimulation(stocks, options, confidence_level, n, scenario_number, weight)
            self._var = hhs.calculate()
            self._losses_of_portfolio = hhs.get_losses_of_portfolio()
            self._percentile_location = hhs.get_percentile_location()

            # Hybrid historical simulation works without sorting the losses. CVaR requires the losses
            # to be sorted to find all the losses lower than the VaR, so sort the losses from largest
            # to smallest.
            self._losses_of_portfolio.sort()
            self._losses_of_portfolio.reverse()
        elif self._var_type == 'Monte Carlo Brownian Motion':
            daily_drift = self._var_parameters[5]
            mc = MonteCarloBrownianMotion(stocks, options, confidence_level, n, scenario_number, daily_drift)
            self._var = mc.calculate()
            self._losses_of_portfolio = mc.get_losses_of_portfolio()
            self._percentile_location = mc.get_percentile_location()
        else:
            mmc = MultivariateMonteCarlo(stocks, options, confidence_level, n, scenario_number)
            self._var = mmc.calculate()
            self._losses_of_portfolio = mmc.get_losses_of_portfolio()
            self._percentile_location = mmc.get_percentile_location()

        # CVaR is calculated as 1/ the percentile location multiplied by the sum of all the highest losses up to and
        # including the loss located at the percentile location.
        # For a 99% confidence level with 500 scenarios, the percentile location would be 5.

        # print('percentile location', self._percentile_location)
        # print('losses of portfolio', self._losses_of_portfolio)

        cvar = round((1 / self._percentile_location) * sum(self._losses_of_portfolio[:self._percentile_location + 1]), 2)

        return [self._var, cvar]