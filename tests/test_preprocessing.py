"""Tests for ml/preprocess.py."""
import pandas as pd

from ml.preprocess import (
    LEAKAGE_COLUMNS,
    TARGET_CATEGORY_COLUMN,
    clean_data,
    construct_target,
    engineer_features,
    load_and_prepare,
    load_raw_data,
)


def test_load_raw_data_drops_unnamed_column():
    df = load_raw_data()
    assert not any(c.startswith("Unnamed") for c in df.columns)


def test_clean_data_drops_user_id_and_duplicates():
    df = load_raw_data()
    df = pd.concat([df, df.iloc[[0]]], ignore_index=True)  # inject a duplicate
    cleaned = clean_data(df)
    assert "user_id" not in cleaned.columns
    assert cleaned.duplicated().sum() == 0


def test_clean_data_enforces_ranges():
    df = load_raw_data()
    bad_row = df.iloc[0].copy()
    bad_row["age"] = 500
    df = pd.concat([df, bad_row.to_frame().T], ignore_index=True)
    cleaned = clean_data(df)
    assert cleaned["age"].max() <= 100


def test_engineer_features_adds_ratio_without_leakage():
    df = clean_data(load_raw_data())
    df = engineer_features(df)
    assert "leisure_screen_ratio" in df.columns
    assert (df["leisure_screen_ratio"] >= 0).all()
    assert (df["leisure_screen_ratio"] <= 1).all()


def test_construct_target_creates_three_balanced_categories():
    df = engineer_features(clean_data(load_raw_data()))
    df, bin_edges = construct_target(df)
    assert TARGET_CATEGORY_COLUMN in df.columns
    categories = set(df[TARGET_CATEGORY_COLUMN].unique())
    assert categories == {"Low", "Moderate", "High"}
    counts = df[TARGET_CATEGORY_COLUMN].value_counts()
    # Quantile-based split should be roughly balanced across the three classes.
    assert counts.min() / counts.max() > 0.5
    assert len(bin_edges) == 4


def test_leakage_columns_not_in_feature_set():
    from ml.preprocess import ALL_FEATURES

    for col in LEAKAGE_COLUMNS:
        assert col not in ALL_FEATURES


def test_load_and_prepare_end_to_end():
    df, bin_edges = load_and_prepare()
    assert df.shape[0] > 0
    assert TARGET_CATEGORY_COLUMN in df.columns
    assert df.isnull().sum().sum() == 0
