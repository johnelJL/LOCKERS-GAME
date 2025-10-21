# Lockers Game

This repository contains a small, pure-Python implementation of the classic
lockers puzzle. It purposefully keeps all assets in human-readable text files so
it can be shared safely through the `make_pr` helper without triggering the
"Binary files are not supported" error.

## Features

- `lockers_game.LockerGame` – object oriented API for running simulations.
- `lockers_game.cli` – command line entry point with JSON output support.
- Helper utilities such as :func:`lockers_game.game.lockers_after_simulation`
  and :func:`lockers_game.game.is_perfect_square_locker`.
- Comprehensive unit tests that keep the implementation easy to reason about.

## Usage

Run the package directly to print the open lockers after the default simulation:

```bash
python -m lockers_game 20
```

Provide explicit rounds or steps:

```bash
python -m lockers_game 20 --rounds 5
python -m lockers_game 12 --steps 1,3,4
```

JSON output is available as well:

```bash
python -m lockers_game 20 --json
```

## Development

Install development dependencies and run the tests:

```bash
pip install -r requirements-dev.txt
pytest
```

All project files are UTF-8 encoded text. Avoid adding binary files to keep pull
request automation working correctly.
