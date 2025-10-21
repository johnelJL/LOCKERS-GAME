"""Command line interface for the lockers game simulation."""

from __future__ import annotations

import argparse
import json
from typing import Iterable, List

from .game import LockerGame, is_perfect_square_locker, lockers_after_simulation


def parse_steps(value: str) -> List[int]:
    """Parse a comma separated list of positive integers."""

    if not value:
        raise argparse.ArgumentTypeError("steps must not be empty")
    try:
        steps = [int(token) for token in value.split(",")]
    except ValueError as exc:  # pragma: no cover - defensive branch
        raise argparse.ArgumentTypeError("steps must contain integers") from exc

    if any(step <= 0 for step in steps):
        raise argparse.ArgumentTypeError("steps must be positive integers")
    return steps


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Simulate the classic lockers puzzle")
    parser.add_argument("locker_count", type=int, help="Number of lockers to simulate")
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "--rounds",
        type=int,
        help="Number of rounds to execute (default: locker count)",
    )
    group.add_argument(
        "--steps",
        type=parse_steps,
        help="Comma separated list of explicit step sizes",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output the simulation result as JSON instead of a human readable string",
    )
    return parser


def format_result(lockers: Iterable[int], *, json_output: bool) -> str:
    if json_output:
        return json.dumps({"open_lockers": list(lockers)})

    return "Open lockers: " + ", ".join(str(index) for index in lockers)


def run_from_args(argv: List[str] | None = None) -> str:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.locker_count <= 0:
        parser.error("locker_count must be greater than zero")

    if args.rounds is not None and args.rounds <= 0:
        parser.error("rounds must be greater than zero")

    game = LockerGame(args.locker_count)
    if args.steps is not None:
        game.simulate(steps=args.steps)
    else:
        game.simulate(rounds=args.rounds)

    return format_result(game.open_lockers(), json_output=args.json)


__all__ = [
    "build_parser",
    "format_result",
    "parse_steps",
    "run_from_args",
    "LockerGame",
    "is_perfect_square_locker",
    "lockers_after_simulation",
]
