import json

import pytest

from lockers_game.cli import format_result, parse_steps, run_from_args


def test_parse_steps_valid_input():
    assert parse_steps("1,2,3") == [1, 2, 3]


def test_parse_steps_invalid_values():
    with pytest.raises(SystemExit):
        run_from_args(["10", "--steps", "0,2"])


def test_format_result_human_readable():
    assert format_result([1, 4], json_output=False) == "Open lockers: 1, 4"


def test_format_result_json():
    result = format_result([1, 4], json_output=True)
    assert json.loads(result) == {"open_lockers": [1, 4]}


def test_run_from_args_default_rounds():
    output = run_from_args(["5"])
    assert output.endswith("1, 4")


def test_run_from_args_json_output():
    result = run_from_args(["5", "--rounds", "3", "--json"])
    data = json.loads(result)
    assert data == {"open_lockers": [1, 5]}


def test_invalid_locker_count_exits():
    with pytest.raises(SystemExit):
        run_from_args(["0"])


def test_invalid_rounds_exit():
    with pytest.raises(SystemExit):
        run_from_args(["5", "--rounds", "0"])
