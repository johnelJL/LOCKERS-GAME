"""Simulation tools for the classic 100 lockers puzzle.

The package exposes :class:`LockerGame` as the main entry point and provides
utility helpers for analysing the state of the lockers after a simulation.
"""

from .game import Locker, LockerGame

__all__ = ["Locker", "LockerGame"]
