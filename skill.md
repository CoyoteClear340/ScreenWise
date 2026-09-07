\# COMPLETE PROJECT PROMPT — SCREENWISE

\## BUILD AN END-TO-END AI/ML PROJECT — SCREENWISE

\---

\### ROLE

Act as a senior full-stack AI/ML engineer.

Build a complete, production-style but student-friendly end-to-end machine learning web application called:

\# ScreenWise

\### AI-Based Mental Wellness Prediction Using Screen-Time and Lifestyle Patterns

The application must allow a user to enter their screen-time, lifestyle and wellness-related information and receive a machine-learning-based mental wellness prediction.

This is an \*\*academic AIML project\*\*, so prioritize:

\- Correct ML methodology

\- Clean architecture

\- Explainability

\- Reproducibility

\- Simple and maintainable code

\- Good UI/UX

\- Clear documentation

Do NOT build only an EDA notebook.

The final result must be a \*\*working end-to-end application\*\*.

\---

\## CRITICAL REQUIREMENTS

\### 1. Dataset Location

The dataset is provided in the project directory as \`ScreenTime vs MentalWellness.csv\`. Use this exact file.

\### 2. UI Design

Create a clean, modern UI with a professional, polished aesthetic.

\*\*DO NOT use gradient color schemes\*\* - instead use solid, well-chosen colors.

The UI should look thoughtfully designed by a human, not obviously AI-generated.

\### 3. No Authentication

Build a direct dashboard experience with no signup/login pages. Users land directly on the application.

\### 4. No Docker

Do not include Docker files or docker-compose.yml. The project should run natively.

\### 5. Dataset First

Before implementing anything, inspect the actual CSV file to understand its structure, column names, data types, and value ranges. Do not assume column names or structure.

\---

\## PHASE 1: DATASET INSPECTION & ANALYSIS

\*\*First, thoroughly inspect the dataset:\*\*

1\. Load \`ScreenTime vs MentalWellness.csv\` from the project directory

2\. Report:

\- Exact filename and location

\- Number of rows and columns

\- Exact column names (do not rename or change them)

\- Data types of each column

\- Missing values count per column

\- Unique values for categorical columns

\- Value ranges for numerical columns

\- Data quality issues (invalid values, outliers, etc.)

3\. Create a data dictionary based on the actual dataset content

\---

\## PHASE 2: ML PIPELINE IMPLEMENTATION

\*\*Build a complete ML pipeline with the following structure:\*\*

\### Project Structure:

\`\`\`

screenwise/

├── README.md

├── .gitignore

├── requirements.txt

│

├── data/

│ └── ScreenTime vs MentalWellness.csv

│

├── notebooks/

│ └── EDA.ipynb

│

├── ml/

│ ├── \_\_init\_\_.py

│ ├── train.py

│ ├── evaluate.py

│ ├── preprocess.py

│ ├── features.py

│ └── predict.py

│

├── artifacts/

│ ├── model.pkl

│ ├── preprocessor.pkl

│ ├── metrics.json

│ ├── feature\_info.json

│ └── model\_metadata.json

│

├── backend/

│ ├── app/

│ │ ├── \_\_init\_\_.py

│ │ ├── main.py

│ │ ├── schemas.py

│ │ ├── predictor.py

│ │ └── config.py

│ └── requirements.txt

│

├── frontend/

│ ├── src/

│ │ ├── App.jsx

│ │ ├── main.jsx

│ │ ├── components/

│ │ │ ├── Home.jsx

│ │ │ ├── PredictionForm.jsx

│ │ │ ├── ResultDashboard.jsx

│ │ │ ├── Disclaimer.jsx

│ │ │ └── Layout.jsx

│ │ ├── services/

│ │ │ └── api.js

│ │ └── styles/

│ │ └── index.css

│ ├── package.json

│ ├── vite.config.js

│ └── index.html

│

└── tests/

├── test\_preprocessing.py

├── test\_prediction.py

└── test\_api.py

\`\`\`

\---

\## PHASE 3: DATA CLEANING & TARGET CONSTRUCTION

\### Clean the Dataset:

1\. Handle missing values appropriately (document the strategy)

2\. Remove duplicate rows if any

3\. Validate numerical ranges

4\. Validate categorical values

5\. Handle any outliers (document the approach)

\### Construct the Target Variable:

1\. After inspecting the dataset, identify relevant wellness-related columns

2\. Normalize these variables to a common scale (0-1 or comparable)

3\. Create a wellness score using the formula:

\`\`\`

Wellness Score = normalized\_wellness\_indicator1 +

normalized\_wellness\_indicator2 +

inverse\_normalized\_stress

\`\`\`

4\. Normalize the final score to 0-100 scale

5\. Create three categories: Low (0-33), Moderate (34-66), High (67-100)

\- Alternatively, use data-driven quantile-based thresholds

6\. Document the exact methodology used

\### IMPORTANT - Data Leakage Prevention:

\- Identify which variables were used to construct the target

\- These variables should NOT be used as input features for prediction

\- Design the prediction problem so features are available before the wellness outcome

\- Document any feature choices and reasoning

\---

\## PHASE 4: EDA & FEATURE ENGINEERING

\### Create a Comprehensive EDA Notebook:

1\. Dataset overview and shape

2\. Data types and missing value analysis

3\. Descriptive statistics for all columns

4\. Distribution plots for all numerical features

5\. Bar charts for categorical features

6\. Correlation heatmap

7\. Screen time distributions

8\. Wellness indicators distributions

9\. Target variable distribution

10\. Scatter plots showing relationships

11\. Insights and observations (without claiming causation)

\### Feature Engineering:

\- Create meaningful derived features based on the actual dataset

\- Examples: total screen time, screen time ratios, etc.

\- Document all feature engineering steps

\---

\## PHASE 5: MODEL TRAINING & EVALUATION

\### Implement Model Training Pipeline:

\*\*1. Train/Test Split:\*\*

\- 80% training, 20% testing

\- random\_state = 42

\- Use stratification for classification

\*\*2. Preprocessing:\*\*

\- Use scikit-learn Pipeline and ColumnTransformer

\- Handle numerical features: scaling

\- Handle categorical features: encoding

\- No preprocessing before split (avoid leakage)

\*\*3. Models to Train (minimum):\*\*

\- Logistic Regression

\- Decision Tree Classifier

\- Random Forest Classifier

\- Gradient Boosting Classifier

\*\*4. Cross-Validation:\*\*

\- 5-Fold Stratified Cross-Validation on training data

\- Compare models using CV scores

\*\*5. Hyperparameter Tuning:\*\*

\- Use GridSearchCV or RandomizedSearchCV

\- Keep search space reasonable for ~400 records

\- For Random Forest: n\_estimators, max\_depth, min\_samples\_split, min\_samples\_leaf

\*\*6. Evaluation Metrics:\*\*

\- Accuracy

\- Precision (weighted)

\- Recall (weighted)

\- F1 Score (weighted)

\- Confusion Matrix

\- Classification Report

\- Training vs testing performance comparison

\*\*7. Select Best Model:\*\*

\- Choose model with best validation performance

\- Evaluate on test set (one time, final evaluation)

\- Document the selection reasoning

\---

\## PHASE 6: MODEL EXPLAINABILITY

\### Implement Feature Importance:

1\. For tree-based models: use \`feature\_importances\_\`

2\. Identify top 5-8 most important features

3\. Display features with their importance scores

4\. Use careful language (correlation, not causation)

5\. Optional: SHAP explanations if cleanly implementable

\---

\## PHASE 7: MODEL SERIALIZATION

\### Save Artifacts:

1\. \*\*model.pkl\*\* - trained model

2\. \*\*preprocessor.pkl\*\* - complete preprocessing pipeline

3\. \*\*metrics.json\*\* - all evaluation metrics

4\. \*\*feature\_info.json\*\* - feature names, types, ranges

5\. \*\*model\_metadata.json\*\*:

\`\`\`json

{

"model\_name": "RandomForestClassifier",

"training\_date": "2026-09-07",

"dataset": "ScreenTime vs MentalWellness.csv",

"random\_state": 42,

"features": \[\],

"metrics": {},

"target\_construction": "methodology description"

}

\`\`\`

\---

\## PHASE 8: BACKEND API (FastAPI)

\### Create REST API Endpoints:

1\. \*\*GET /health\*\* - Return API status

2\. \*\*GET /model-info\*\* - Return model metadata

3\. \*\*POST /predict\*\* - Accept user input, return prediction

\### Pydantic Schemas:

\- Validate all input fields

\- Age range: based on dataset

\- Screen time ranges: 0-24 hours

\- All scales: based on actual dataset ranges

\- Return clear validation errors with helpful messages

\### Prediction Request Structure (must match actual dataset):

\`\`\`json

{

"age": 20,

"gender": "Male",

"occupation": "Student",

"mobile\_screen\_time": 5.2,

"laptop\_screen\_time": 4.5,

"tv\_screen\_time": 1.0,

"sleep\_quality": 6,

"stress\_level": 7,

"productivity\_score": 6,

"mood": 6,

"energy": 5,

"focus": 6

}

\`\`\`

\### Prediction Response Structure:

\`\`\`json

{

"prediction": "Moderate",

"score": 67.4,

"confidence": 0.78,

"top\_factors": \[

{"feature": "total\_screen\_time", "importance": 0.31},

{"feature": "sleep\_quality", "importance": 0.25},

{"feature": "stress\_level", "importance": 0.18}

\]

}

\`\`\`

\---

\## PHASE 9: FRONTEND (React + Vite + Tailwind CSS)

\### Design System:

\- Clean, professional color palette with NO gradients

\- Use solid, well-chosen colors

\- Calm, wellness-appropriate aesthetic

\- Modern typography and spacing

\- Responsive design for all screen sizes

\### Pages:

\*\*1. Home Page (\`/\`):\*\*

\- Project title: ScreenWise

\- Subtitle: Understand your digital lifestyle. Get an AI-powered wellness prediction.

\- Brief description of the tool

\- CTA Button: "Check My Wellness" → navigates to form

\*\*2. Prediction Form Page (\`/predict\`):\*\*

\- Multi-section form with clear labels

\- Section 1: Personal Information (age, gender, occupation)

\- Section 2: Screen Time (mobile, laptop, TV)

\- Section 3: Lifestyle (sleep quality, stress, productivity, mood, energy, focus)

\- Use appropriate input types:

\- Dropdowns for categorical fields

\- Number inputs or sliders for numerical fields

\- Sliders for 1-10 scales

\- Client-side validation before submission

\- "Predict My Wellness" button with loading state

\- Loading text: "Analyzing your lifestyle pattern..."

\*\*3. Result Dashboard (\`/result\`):\*\*

\- Large, clear prediction result (Low/Moderate/High)

\- Wellness Score (X/100)

\- Prediction confidence percentage

\- Key model factors with importance bars

\- Simple interpretation text

\- Disclaimer prominently displayed

\- "Check Again" button

\### Components Required:

\- Clean, reusable form components

\- Loading spinner

\- Error handling with user-friendly messages

\- Responsive header

\- Disclaimer component (appears on result page)

\### Validation Rules:

\- All required fields must be filled

\- Age must be within valid range (from dataset)

\- Screen times between 0-24

\- All 1-10 scales validated

\- Show user-friendly error messages

\### API Integration:

\- Use environment variable for API URL (VITE\_API\_URL)

\- Handle loading states

\- Handle success states

\- Handle error states

\- Never show raw stack traces to users

\---

\## PHASE 10: TESTING

\### Backend Tests:

\- Test /health endpoint

\- Test /predict with valid data

\- Test /predict with invalid data (missing fields, out of range)

\- Test model loading

\- Test preprocessing

\### Frontend Tests:

\- Verify form rendering

\- Verify client-side validation

\- Verify API integration

\- Verify result rendering

\- Verify error handling

\---

\## PHASE 11: DOCUMENTATION

\### README.md must include:

1\. Project Overview

2\. Problem Statement

3\. Features

4\. Dataset Description (based on actual inspection)

5\. Target Construction Methodology

6\. Feature Engineering Approach

7\. Models Compared

8\. Evaluation Metrics (actual values)

9\. Final Model Selection (with reasoning)

10\. System Architecture

11\. Tech Stack

12\. Project Structure

13\. Installation Instructions

14\. Running ML Training

15\. Running Backend

16\. Running Frontend

17\. API Documentation

18\. Example Request/Response

19\. Screenshots (add placeholder for actual screenshots)

20\. Limitations

21\. Future Scope

22\. Disclaimer

\---

\## PHASE 12: INSTALLATION & RUNNING

\### ML Setup:

\`\`\`bash

python -m venv .venv

source .venv/bin/activate # or .venv\\Scripts\\activate on Windows

pip install -r requirements.txt

python ml/train.py

\`\`\`

\### Backend Setup:

\`\`\`bash

cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload

\# Runs on http://localhost:8000

\# API docs available at http://localhost:8000/docs

\`\`\`

\### Frontend Setup:

\`\`\`bash

cd frontend

npm install

npm run dev

\# Runs on http://localhost:5173

\`\`\`

\### Environment Variable:

Create \`.env\` in frontend directory:

\`\`\`

VITE\_API\_URL=http://localhost:8000

\`\`\`

\---

\## CRITICAL RULES

\### DO NOT:

\- Fabricate any metrics, statistics, or results

\- Assume column names without inspecting the dataset

\- Skip the dataset inspection phase

\- Use test data for training or validation

\- Preprocess data before train/test split

\- Use target variables as input features (leakage)

\- Claim causation from correlations

\- Claim medical validity

\- Diagnose medical conditions

\- Hardcode prediction values

\- Use gradients in UI design

\- Create signup/login pages

\- Use Docker

\### DO:

\- Inspect the actual CSV first

\- Document everything

\- Use actual trained model for every prediction

\- Build clean, modular code

\- Include comprehensive error handling

\- Write professional documentation

\- Make the UI feel thoughtfully designed

\- Use proper ML methodology

\- Include proper disclaimers

\- Handle all edge cases

\---

\## FINAL ACCEPTANCE CRITERIA

The project is complete when:

\### ML Pipeline:

\- \[ \] Dataset loads correctly from provided CSV

\- \[ \] Data cleaning works

\- \[ \] Target is constructed correctly

\- \[ \] Multiple models are trained

\- \[ \] Cross-validation performed

\- \[ \] Best model selected based on actual results

\- \[ \] Model artifacts saved

\### Backend:

\- \[ \] FastAPI starts successfully

\- \[ \] /health endpoint works

\- \[ \] /predict endpoint works

\- \[ \] Input validation works

\- \[ \] Model loads from artifacts

\- \[ \] Returns actual predictions (not hardcoded)

\### Frontend:

\- \[ \] React app starts

\- \[ \] Home page renders correctly

\- \[ \] Form works with validation

\- \[ \] API integration works

\- \[ \] Loading state shows

\- \[ \] Results display correctly

\- \[ \] Error handling works

\- \[ \] No gradient color schemes

\- \[ \] Professional, human-designed aesthetic

\### Integration:

\- \[ \] User can open website

\- \[ \] Enter information

\- \[ \] Click predict

\- \[ \] See prediction result

\- \[ \] See score and factors

\- \[ \] Works without terminal interaction

\### User Journey:

\`\`\`

Open Website

↓

Enter Information

↓

Click Predict

↓

Wait for ML Prediction

↓

See Wellness Result

↓

See Score / Category

↓

See Important Factors

\`\`\`

\---

\## DELIVERABLES

1\. Complete source code with all components

2\. Working ML pipeline with trained model

3\. FastAPI backend with all endpoints

4\. React frontend with all pages

5\. EDA notebook with visualizations

6\. Comprehensive README

7\. All tests passing

8\. Clear installation instructions

\---

\## FINAL INSTRUCTION

Build this project incrementally, with dataset inspection as the first step. Every component must work together to create a complete, polished, and functional end-to-end AI/ML application.

The final system must use the \*\*actual trained ML model for every prediction\*\*.

The final deliverable must be a working:

\# DATASET → ML PIPELINE → FASTAPI → REACT → REAL-TIME PREDICTION

application.

\---

\## DISCLAIMER

\*\*ScreenWise is an educational AI/ML project that predicts wellness patterns from the provided dataset. It is not a medical or psychological diagnostic tool and should not be used as a substitute for professional advice.\*\*

\---

\*\*END OF PROMPT\*\*