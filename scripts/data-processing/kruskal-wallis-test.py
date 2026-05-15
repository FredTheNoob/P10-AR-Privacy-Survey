import pandas as pd
import numpy as np
from scipy.stats import kruskal, mannwhitneyu
from itertools import combinations

# 1. Load the data
df = pd.read_csv('survey-questions.csv')

# 2. Define the Mapping and Target Question
likert_map = {
    "Strongly disagree": 1,
    "Disagree": 2,
    "Neutral": 3,
    "Agree": 4,
    "Strongly agree": 5
}

# You can change this string to run the same code for RQ3 or RQ6
target_question = "I am comfortable with this image being processed by an AI system."

def run_analysis(data, question):
    print(f"--- Analysis for: {question} ---")
    
    # 3. Filter and Map
    df_q = data[data['question'] == question].copy()
    df_q['score'] = df_q['answer'].map(likert_map)
    
    methods = ['NONE', 'BLUR', 'BLACK_BOX', 'GEN_CENSORING']
    
    # 4. Pivot into Wide Format (Blocks = Participant + Scenario)
    # This creates a table where each row is a trial and columns are the 4 methods
    pivot_df = df_q.pivot(index=['prolificId', 'scenario'], 
                          columns='censoringMethod', 
                          values='score').dropna()
    
    # 5. Execute Kruskal-Wallis Test
    stat, p = kruskal(
        pivot_df['NONE'],
        pivot_df['BLUR'],
        pivot_df['BLACK_BOX'],
        pivot_df['GEN_CENSORING']
    )
    
    print(f"Kruskal-Wallis Test Statistic: {stat:.4f}")
    print(f"P-value: {p:.4f}")
    
    # 6. Post-hoc Analysis (Only if Kruskal-Wallis is significant)
    if p < 0.05:
        print("\nSignificant difference found. Running Post-hoc Mann-Whitney U Tests...")
        
        pairs = list(combinations(methods, 2))
        
        # Bonferroni Correction
        bonferroni_alpha = 0.05 / len(pairs)
        print(f"Bonferroni Corrected Alpha: {bonferroni_alpha:.4f}\n")
        
        results = []
        
        for m1, m2 in pairs:
            # Mann-Whitney U Test for independent samples
            stat_u, p_u = mannwhitneyu(
                pivot_df[m1],
                pivot_df[m2],
                alternative='two-sided'
            )
            
            is_significant = "YES" if p_u < bonferroni_alpha else "no"
            
            results.append({
                "Comparison": f"{m1} vs {m2}",
                "P-value": f"{p_u:.4f}",
                "Significant?": is_significant
            })
        
        print(pd.DataFrame(results))
        
    else:
        print("\nNo significant difference found between methods.")

# Run the function
run_analysis(df, target_question)