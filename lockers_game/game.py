"""Core simulation logic for the lockers puzzle.

The so called "lockers game" is a recreational mathematics puzzle where
students take turns toggling lockers that are initially closed. The first
student toggles every locker, the second toggles every second locker, the third
student toggles every third locker and so on. After the final round only the
lockers whose positions are perfect squares remain open.

This module provides a small, well documented implementation of that game with
utility helpers that make it easy to integrate the simulation in other
applications.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Sequence


@dataclass
class Locker:
    """Simple value object representing a single locker."""

    index: int
    is_open: bool = False

    def toggle(self) -> None:
        """Invert the state of the locker."""

        self.is_open = not self.is_open


class LockerGame:
    """Run one or more rounds of the lockers puzzle.

    Parameters
    ----------
    locker_count:
        Number of lockers that should take part in the simulation.
    """

    def __init__(self, locker_count: int) -> None:
        if locker_count <= 0:
            raise ValueError("locker_count must be greater than zero")

        self._lockers: List[Locker] = [Locker(index=i + 1) for i in range(locker_count)]

    @property
    def lockers(self) -> Sequence[Locker]:
        """Return an immutable view of the lockers.

        The returned sequence should not be mutated directly; callers should
        instead rely on :meth:`run_round` or :meth:`simulate`.
        """

        return tuple(self._lockers)

    def reset(self) -> None:
        """Reset all lockers to the closed state."""

        for locker in self._lockers:
            locker.is_open = False

    def run_round(self, step: int) -> None:
        """Run a single round of toggling with the provided step.

        Parameters
        ----------
        step:
            The step size used by the student during the round. Every locker
            whose index is a multiple of ``step`` is toggled. ``step`` must be a
            positive integer.
        """

        if step <= 0:
            raise ValueError("step must be greater than zero")

        for locker in self._lockers:
            if locker.index % step == 0:
                locker.toggle()

    def simulate(self, *, rounds: int | None = None, steps: Iterable[int] | None = None) -> None:
        """Run a complete simulation.

        Exactly one of ``rounds`` or ``steps`` may be provided. ``rounds``
        triggers the classic behaviour of running step sizes from one to the
        specified value. ``steps`` allows callers to supply a custom sequence of
        step sizes.
        """

        if rounds is not None and steps is not None:
            raise ValueError("Specify either rounds or steps, not both")

        if rounds is None and steps is None:
            rounds = len(self._lockers)

        if rounds is not None:
            if rounds <= 0:
                raise ValueError("rounds must be greater than zero")
            for step in range(1, rounds + 1):
                self.run_round(step)
            return

        resolved_steps = list(steps or [])
        if not resolved_steps:
            raise ValueError("steps must contain at least one value")
        for step in resolved_steps:
            self.run_round(step)

    def open_lockers(self) -> List[int]:
        """Return the indices of all open lockers."""

        return [locker.index for locker in self._lockers if locker.is_open]

    def closed_lockers(self) -> List[int]:
        """Return the indices of all closed lockers."""

        return [locker.index for locker in self._lockers if not locker.is_open]

    def as_state_string(self) -> str:
        """Return a compact textual representation of the lockers state.

        Open lockers are represented using ``"O"`` while closed lockers use
        ``"X"``. The result is a string with one character per locker which is
        useful for debugging or visualising small simulations.
        """

        return "".join("O" if locker.is_open else "X" for locker in self._lockers)


def lockers_after_simulation(locker_count: int) -> List[int]:
    """Convenience helper for the classic puzzle configuration."""

    game = LockerGame(locker_count)
    game.simulate()
    return game.open_lockers()


def is_perfect_square_locker(index: int) -> bool:
    """Return ``True`` if the locker stays open in the classic puzzle."""

    if index <= 0:
        raise ValueError("index must be greater than zero")

    root = int(index**0.5)
    return root * root == index
