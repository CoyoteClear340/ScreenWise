"""Data loading, cleaning, and target construction for ScreenWise."""
import numpy as np
import pandas as pd

RAW_CSV_PATH = "data/ScreenTime vs MentalWellness.csv"

# Columns used to originally construct mental_wellness_index_0_100.
# Excluded from model features to prevent data leakage.
LEAKAGE_COLUMNS = ["productivity_0_100", "sleep_quality_1_5", "stress_level_0_10"]

TARGET_RAW_COLUMN = "mental_wellness_index_0_100"
TARGET_CATEGORY_COLUMN = "wellness_category"

NUMERIC_FEATURES = [
    "age",
    "screen_time_hours",
    "work_screen_hours",
    "leisure_screen_hours",
    "sleep_hours",
    "exercise_minutes_per_week",
    "social_hours_per_week",
    "leisure_screen_ratio",
]
CATEGORICAL_FEATURES = ["gender", "occupation", "work_mode"]
ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES


def load_raw_data(path: str = RAW_CSV_PATH) -> pd.DataFrame:
    """Load the raw ScreenWise dataset."""
    df = pd.read_csv(path)
    # Drop the trailing unnamed artifact column produced by a trailing comma
    # in the source CSV header (entirely NaN, not part of the real schema).
    df = df.loc[:, ~df.columns.str.startswith("Unnamed")]
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean the raw dataframe: drop duplicates/id, validate ranges."""
    df = df.copy()
    df = df.drop_duplicates()
    if "user_id" in df.columns:
        df = df.drop(columns=["user_id"])

    # Range validation based on values actually observed in Phase 1 inspection.
    df = df[(df["age"] >= 10) & (df["age"] <= 100)]
    df = df[(df["screen_time_hours"] >= 0) & (df["screen_time_hours"] <= 24)]
    df = df[(df["work_screen_hours"] >= 0) & (df["work_screen_hours"] <= 24)]
    df = df[(df["leisure_screen_hours"] >= 0) & (df["leisure_screen_hours"] <= 24)]
    df = df[(df["sleep_hours"] >= 0) & (df["sleep_hours"] <= 24)]
    df = df[(df["sleep_quality_1_5"] >= 1) & (df["sleep_quality_1_5"] <= 5)]
    df = df[(df["stress_level_0_10"] >= 0) & (df["stress_level_0_10"] <= 10)]
    df = df[(df["productivity_0_100"] >= 0) & (df["productivity_0_100"] <= 100)]
    df = df[(df["exercise_minutes_per_week"] >= 0)]
    df = df[(df["social_hours_per_week"] >= 0)]
    df = df[(df["mental_wellness_index_0_100"] >= 0) & (df["mental_wellness_index_0_100"] <= 100)]

    df = df.reset_index(drop=True)
    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add derived features. All inputs come from non-leakage columns."""
    df = df.copy()
    df["leisure_screen_ratio"] = df["leisure_screen_hours"] / df["screen_time_hours"].replace(0, np.nan)
    df["leisure_screen_ratio"] = df["leisure_screen_ratio"].fillna(0)
    return df


def construct_target(df: pd.DataFrame, n_categories: int = 3):
    """Use the dataset's existing mental_wellness_index_0_100 as the wellness
    score, and bucket it into quantile-based categories (Low/Moderate/High).

    Methodology: `mental_wellness_index_0_100` was found (see notebooks/EDA.ipynb)
    to correlate ~0.96 with normalized_productivity + normalized_sleep_quality +
    inverse_normalized_stress, i.e. it is already the wellness score described in
    the project brief. We reuse it directly rather than re-deriving an
    approximation, and exclude productivity_0_100, sleep_quality_1_5, and
    stress_level_0_10 from the feature set since they were used to build it.

    Fixed thresholds (0-33 / 34-66 / 67-100) were rejected because the raw
    index is heavily right-skewed (mean ~20, 75th percentile ~31) and would
    put over 70% of records into "Low". We instead use tercile (33rd/66th
    percentile) quantile thresholds computed on the full cleaned dataset, so
    each class is reasonably represented for classification.
    """
    df = df.copy()
    score = df[TARGET_RAW_COLUMN]
    labels = ["Low", "Moderate", "High"]
    categories, bin_edges = pd.qcut(score, q=n_categories, labels=labels, retbins=True, duplicates="drop")
    df[TARGET_CATEGORY_COLUMN] = categories.astype(str)
    return df, bin_edges.tolist()


def load_and_prepare(path: str = RAW_CSV_PATH):
    """Full pipeline: load -> clean -> engineer -> construct target."""
    df = load_raw_data(path)
    df = clean_data(df)
    df = engineer_features(df)
    df, bin_edges = construct_target(df)
    return df, bin_edges
