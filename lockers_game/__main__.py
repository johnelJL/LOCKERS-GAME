"""Module entry point for ``python -m lockers_game``."""

from .cli import run_from_args


def main() -> None:
    print(run_from_args())


if __name__ == "__main__":  # pragma: no cover - module level entry point
    main()
