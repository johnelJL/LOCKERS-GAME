from lockers_game.game import (
    LockerGame,
    is_perfect_square_locker,
    lockers_after_simulation,
)


def test_lockers_after_simulation_matches_perfect_squares():
    open_lockers = lockers_after_simulation(20)
    assert open_lockers == [1, 4, 9, 16]


def test_is_perfect_square_locker():
    assert is_perfect_square_locker(1) is True
    assert is_perfect_square_locker(16) is True
    assert is_perfect_square_locker(18) is False


def test_simulate_with_custom_steps():
    game = LockerGame(5)
    game.simulate(steps=[2, 3])
    assert game.open_lockers() == [2, 3, 4]
    assert game.as_state_string() == "XOOOX"


def test_reset_restores_closed_state():
    game = LockerGame(3)
    game.simulate(rounds=1)
    assert game.open_lockers() == [1, 2, 3]
    game.reset()
    assert game.open_lockers() == []


def test_run_round_validation():
    game = LockerGame(3)
    try:
        game.run_round(0)
    except ValueError:
        pass
    else:  # pragma: no cover - defensive
        raise AssertionError("Expected ValueError when using an invalid step")


def test_is_perfect_square_validation():
    try:
        is_perfect_square_locker(0)
    except ValueError:
        pass
    else:  # pragma: no cover - defensive
        raise AssertionError("Expected ValueError when using an invalid index")
