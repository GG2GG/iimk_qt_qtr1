import pandas as pd
import os

def load_data():
    """
    Loads the Students Social Media Addiction dataset.
    Performs basic cleaning and ensures correct data types.
    """
    # Look for the file in the parent project directory relative to this backend file
    # Assuming structure: /project_QT/backend/utils/data_loader.py or similar
    # We need to find "Students Social Media Addiction.csv" in /project_QT/
    
    # Base dir is the folder containing the backend folder (i.e. project_QT)
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # Try multiple possible locations
    possible_paths = [
        "Students Social Media Addiction.csv",
        os.path.join(base_dir, "Students Social Media Addiction.csv"),
        "../Students Social Media Addiction.csv",
        "/Users/gg/Documents/project_QT/Students Social Media Addiction.csv"
    ]
    
    file_path = None
    for path in possible_paths:
        if os.path.exists(path):
            file_path = path
            break
            
    if not file_path:
        print("Dataset not found.")
        return pd.DataFrame()
    
    try:
        df = pd.read_csv(file_path)
        
        # Ensure numeric columns are actually numeric
        numeric_cols = ['Age', 'Avg_Daily_Usage_Hours', 'Sleep_Hours_Per_Night', 
                        'Mental_Health_Score', 'Conflicts_Over_Social_Media', 'Addicted_Score']
        
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
                
        return df
        
    except Exception as e:
        print(f"An error occurred while loading data: {e}")
        return pd.DataFrame()

def get_data_dictionary():
    """Returns a dictionary explaining the columns."""
    return {
        "Student_ID": "Unique identifier for each student",
        "Age": "Age of the student",
        "Gender": "Gender of the student",
        "Academic_Level": "Current academic level (e.g., Undergraduate, Graduate)",
        "Country": "Country of residence",
        "Avg_Daily_Usage_Hours": "Average hours spent on social media daily",
        "Most_Used_Platform": "Primary social media platform used",
        "Affects_Academic_Performance": "Self-reported impact on academics (Yes/No)",
        "Sleep_Hours_Per_Night": "Average hours of sleep per night",
        "Mental_Health_Score": "Self-reported mental health score (1-10 scale)",
        "Relationship_Status": "Current relationship status",
        "Conflicts_Over_Social_Media": "Number of conflicts caused by social media usage",
        "Addicted_Score": "Calculated addiction score (derived metric)"
    }
