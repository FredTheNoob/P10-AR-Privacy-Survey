import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

likert_map = {
    "Strongly Disagree": 1,
    "Disagree": 2,
    "Neutral": 3,
    "Agree": 4,
    "Strongly Agree": 5,
}


def censoring_scenario_question(df):
    palette = {
        "AI answered": "crimson",
        "Question 1": "steelblue",
        "Question 2": "darkorange",
        "Question 3": "seagreen"
    }

    # Compute averages grouped by scenario, censoringmethod, and question
    grouped = (
        df.groupby(["scenario", "censoringMethod", "question"])["answer_numeric"]
        .mean()
        .reset_index()
    )

    grouped["question_group"] = grouped["question"].apply(
        lambda q: "AI answered" if "AI answered" in q else "Question 1" if "I am comfortable with this image being processed by an AI system." in q else "Question 2" if "I am concerned that personal information from this image could be used maliciously." in q else "Question 3"
    )

    grouped["x_label"] = (
        grouped["censoringMethod"].astype(str)
        + " | " +
        grouped["scenario"].astype(str)
    )

    # Plot grouped bar chart
    g = sns.catplot(
        data=grouped,
        kind="bar",
        x="censoringMethod",
        y="answer_numeric",
        hue="question_group",
        col="scenario",
        palette=palette,
        height=5,
        aspect=1.2
    )

    g.set_axis_labels("Censoring Method", "Average Likert Score")
    g.set_titles("Scenario: {col_name}") 

    # move legend outside
    g._legend.set_title("Question")
    g._legend.set_frame_on(True)
    g._legend.get_frame().set_alpha(0.6)
    g._legend.set_bbox_to_anchor((1, 0.85))

    for ax in g.axes.flat:
        ax.set_xticklabels(ax.get_xticklabels(), rotation=30)

    plt.tight_layout()
    plt.show()


def censoring_question(df):
    pass

def scenario_question(df):
    pass

def main():
    # Load CSV
    df = pd.read_csv("survey-questions.csv")
    df["answer_numeric"] = df["answer"].map(likert_map)
    df = df.dropna(subset=["answer_numeric"])

    censoring_scenario_question(df)

main()