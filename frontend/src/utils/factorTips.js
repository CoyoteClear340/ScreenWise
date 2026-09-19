// Turns a top-factor feature name + the user's actual answer into a short,
// actionable one-liner. Thresholds are rough, non-clinical rules of thumb —
// framed as suggestions, not diagnoses, consistent with the app's disclaimer.

function tip(text) {
  return text;
}

const TIP_RULES = {
  screen_time_hours: (v) => {
    if (v >= 10) return tip("Your total screen time is on the higher side — try blocking out a few screen-free hours in your day.");
    if (v >= 6) return tip("Your screen time is moderate — keep an eye on how it splits between work and leisure.");
    return tip("Your total screen time is relatively low — a healthy baseline to keep.");
  },
  work_screen_hours: (v) => {
    if (v >= 8) return tip("Work screen time is heavy — short breaks like the 20-20-20 rule can ease eye and mental fatigue.");
    if (v >= 4) return tip("Work screen time looks typical — regular breaks still help over a full day.");
    return tip("Work screen time is on the lighter side.");
  },
  leisure_screen_hours: (v) => {
    if (v >= 5) return tip("Leisure screen time is high — swapping part of it for an offline hobby could help.");
    if (v >= 2) return tip("Leisure screen time looks reasonable — just watch for late-night creep.");
    return tip("Leisure screen time is low — good balance with offline time.");
  },
  sleep_hours: (v) => {
    if (v < 6) return tip("You're getting less sleep than recommended — a consistent wind-down routine before bed can help.");
    if (v <= 9) return tip("Your sleep falls in a healthy range — try to keep the schedule consistent.");
    return tip("You're sleeping more than typical — if you still feel tired, it may be worth looking at sleep quality.");
  },
  exercise_minutes_per_week: (v) => {
    if (v < 90) return tip("Exercise is below the commonly recommended ~150 min/week — even short daily walks add up.");
    if (v <= 250) return tip("You're getting a solid amount of weekly activity — keep it consistent.");
    return tip("You're highly active — make sure recovery and rest keep pace with training.");
  },
  social_hours_per_week: (v) => {
    if (v < 4) return tip("Social time is on the lower side — even brief regular check-ins with people can help.");
    if (v <= 20) return tip("Your social time looks balanced.");
    return tip("You're very socially active — pair it with some solo downtime too.");
  },
  age: () => tip("Age is context the model uses, not something to change — the factors below are."),
  gender: () => tip("This reflects a profile detail, not a habit — focus on the actionable factors instead."),
  occupation: () => tip("Occupation shapes context like typical work screen time, rather than being directly actionable."),
  work_mode: (v) =>
    v === "Remote"
      ? tip("Remote work often blurs work/leisure screen time — clear start/stop boundaries can help.")
      : tip("Your work mode is context the model uses alongside your screen time habits."),
};

export function getFactorTip(feature, value) {
  const rule = TIP_RULES[feature];
  if (!rule || value === undefined || value === null) {
    return "This factor contributed to your prediction, based on patterns in the training data.";
  }
  return rule(value);
}
