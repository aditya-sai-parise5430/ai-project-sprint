"""
Curated project library — single source of truth.
Matching logic lives in services/matcher.py.
"""

PROJECTS = [
    {
        "id": "sentiment-analyzer",
        "title": "Twitter Sentiment Analyzer",
        "description": (
            "Build a web app that analyses the sentiment of any tweet or text snippet "
            "using a pre-trained HuggingFace transformer model. Users paste text and "
            "get instant positive/negative/neutral scores with a confidence bar."
        ),
        "why_description": (
            "NLP projects are top-requested by product and data teams at top companies. "
            "A working sentiment tool demonstrates real business value."
        ),
        "tech_stack": ["Python", "Streamlit", "HuggingFace Transformers", "Pandas"],
        "build_plan": [
            {"step": 1, "title": "Setup & Install", "duration_mins": 5,
             "desc": "Create venv, install streamlit and transformers via pip."},
            {"step": 2, "title": "Load the Model", "duration_mins": 10,
             "desc": "Use HuggingFace pipeline('sentiment-analysis') — one line of code."},
            {"step": 3, "title": "Build the UI", "duration_mins": 15,
             "desc": "st.text_area for input, st.button to trigger, st.metric to display result."},
            {"step": 4, "title": "Add Batch Mode", "duration_mins": 15,
             "desc": "Accept CSV upload with a text column; analyse all rows and show a bar chart."},
            {"step": 5, "title": "Polish & Deploy", "duration_mins": 15,
             "desc": "Add a title, logo, description and deploy free on Streamlit Community Cloud."},
        ],
        "difficulty": "beginner",
        "ai_domains": ["NLP"],
        "suitable_goals": ["Placement", "Internship", "Learning"],
    },
    {
        "id": "resume-screener",
        "title": "AI Resume Screener",
        "description": (
            "Build a tool that compares a candidate's resume against a job description "
            "and scores the match. Uses TF-IDF or sentence-transformers to compute "
            "semantic similarity and highlights missing keywords."
        ),
        "why_description": (
            "HR tech is one of the fastest growing AI application areas. "
            "This project directly maps to your placement goal — recruiters love seeing tools "
            "they'd actually use."
        ),
        "tech_stack": ["Python", "Streamlit", "scikit-learn", "PyMuPDF"],
        "build_plan": [
            {"step": 1, "title": "Setup", "duration_mins": 5,
             "desc": "Install streamlit, scikit-learn, pymupdf."},
            {"step": 2, "title": "PDF Parser", "duration_mins": 10,
             "desc": "Use PyMuPDF to extract text from uploaded PDF resume."},
            {"step": 3, "title": "Similarity Engine", "duration_mins": 15,
             "desc": "TF-IDF vectorise both documents and compute cosine similarity."},
            {"step": 4, "title": "Keyword Gap Report", "duration_mins": 15,
             "desc": "Show which JD keywords are missing from the resume."},
            {"step": 5, "title": "Polish & Share", "duration_mins": 15,
             "desc": "Add score badge, deploy on Streamlit Cloud."},
        ],
        "difficulty": "intermediate",
        "ai_domains": ["NLP", "ML"],
        "suitable_goals": ["Placement"],
    },
    {
        "id": "image-classifier",
        "title": "Image Classifier Web App",
        "description": (
            "Build a drag-and-drop web app that classifies any uploaded image into "
            "1000 categories using a pre-trained ResNet model. Shows top-5 predictions "
            "with confidence scores."
        ),
        "why_description": (
            "Computer Vision is the most visual AI skill you can demo. "
            "Upload a photo of anything and watch the model explain what it sees — "
            "guaranteed to impress in any interview."
        ),
        "tech_stack": ["Python", "Streamlit", "PyTorch", "torchvision", "Pillow"],
        "build_plan": [
            {"step": 1, "title": "Setup", "duration_mins": 5,
             "desc": "Install torch, torchvision, streamlit."},
            {"step": 2, "title": "Load ResNet", "duration_mins": 10,
             "desc": "torchvision.models.resnet50(pretrained=True) — one line."},
            {"step": 3, "title": "Preprocess Images", "duration_mins": 10,
             "desc": "Resize, normalise using ImageNet transforms."},
            {"step": 4, "title": "Run Inference", "duration_mins": 15,
             "desc": "Softmax the logits, map to ImageNet labels, show top-5."},
            {"step": 5, "title": "Build UI & Deploy", "duration_mins": 20,
             "desc": "Drag-and-drop file uploader, horizontal bar chart for predictions."},
        ],
        "difficulty": "beginner",
        "ai_domains": ["CV"],
        "suitable_goals": ["Placement", "Learning"],
    },
    {
        "id": "chatbot-faq",
        "title": "College FAQ Chatbot",
        "description": (
            "Build a retrieval-based chatbot that answers questions about any college "
            "using a curated FAQ dataset. Uses TF-IDF retrieval to find the best answer "
            "from a knowledge base."
        ),
        "why_description": (
            "Chatbots are the #1 AI use case in enterprise. "
            "This project teaches the fundamentals of retrieval-based NLP "
            "without needing an API key or paid service."
        ),
        "tech_stack": ["Python", "Streamlit", "scikit-learn", "JSON"],
        "build_plan": [
            {"step": 1, "title": "Setup", "duration_mins": 5,
             "desc": "Install streamlit, scikit-learn."},
            {"step": 2, "title": "Build FAQ Dataset", "duration_mins": 10,
             "desc": "Create a JSON file with 20–30 Q&A pairs about any topic."},
            {"step": 3, "title": "TF-IDF Retrieval", "duration_mins": 15,
             "desc": "Vectorise questions, find closest match to user query by cosine similarity."},
            {"step": 4, "title": "Chat UI", "duration_mins": 15,
             "desc": "st.chat_message for WhatsApp-style chat bubbles."},
            {"step": 5, "title": "Deploy", "duration_mins": 15,
             "desc": "Push to GitHub, deploy on Streamlit Cloud for free."},
        ],
        "difficulty": "beginner",
        "ai_domains": ["NLP"],
        "suitable_goals": ["Placement", "Internship", "Learning", "Startup"],
    },
    {
        "id": "stock-predictor",
        "title": "Stock Price Trend Predictor",
        "description": (
            "Build an ML model that predicts whether a stock will rise or fall the next day "
            "using technical indicators (RSI, MACD, moving averages) from historical data."
        ),
        "why_description": (
            "FinTech is one of the highest-paying AI domains. "
            "This project combines data engineering + ML and makes an excellent "
            "portfolio piece for quant/data roles."
        ),
        "tech_stack": ["Python", "pandas", "scikit-learn", "yfinance", "Streamlit"],
        "build_plan": [
            {"step": 1, "title": "Fetch Data", "duration_mins": 10,
             "desc": "Use yfinance to download 2 years of OHLCV data for any ticker."},
            {"step": 2, "title": "Engineer Features", "duration_mins": 15,
             "desc": "Compute RSI, MACD, 20-day MA, 50-day MA as model features."},
            {"step": 3, "title": "Train Model", "duration_mins": 15,
             "desc": "Random Forest classifier, train-test split, evaluate with accuracy + confusion matrix."},
            {"step": 4, "title": "Predict Today", "duration_mins": 10,
             "desc": "Fetch latest data, run features, output UP/DOWN prediction with confidence."},
            {"step": 5, "title": "Dashboard", "duration_mins": 10,
             "desc": "Streamlit chart showing price history + prediction badge."},
        ],
        "difficulty": "intermediate",
        "ai_domains": ["ML"],
        "suitable_goals": ["Placement", "Startup"],
    },
    {
        "id": "spam-detector",
        "title": "Email Spam Detector",
        "description": (
            "Build a spam classifier that scores any email as spam or not-spam "
            "using Naive Bayes on the classic SpamAssassin dataset. "
            "Includes a live test UI."
        ),
        "why_description": (
            "Text classification is the bread-and-butter of NLP and ML. "
            "This project teaches the full ML pipeline from raw data to deployed model — "
            "perfect for demonstrating fundamentals in interviews."
        ),
        "tech_stack": ["Python", "scikit-learn", "pandas", "Streamlit"],
        "build_plan": [
            {"step": 1, "title": "Load Dataset", "duration_mins": 10,
             "desc": "Load SpamAssassin CSV from a public URL with pandas."},
            {"step": 2, "title": "Vectorise Text", "duration_mins": 10,
             "desc": "TF-IDF vectoriser on email body text."},
            {"step": 3, "title": "Train Naive Bayes", "duration_mins": 10,
             "desc": "MultinomialNB, 80/20 split, print accuracy and classification report."},
            {"step": 4, "title": "Build Test UI", "duration_mins": 15,
             "desc": "Text area to paste an email, classify button, result with probability bar."},
            {"step": 5, "title": "Deploy", "duration_mins": 15,
             "desc": "Streamlit Cloud free deployment."},
        ],
        "difficulty": "beginner",
        "ai_domains": ["ML", "NLP"],
        "suitable_goals": ["Placement", "Learning"],
    },
    {
        "id": "face-attendance",
        "title": "Face Recognition Attendance System",
        "description": (
            "Build an attendance system that recognises registered faces via webcam "
            "and logs attendance to a CSV. Uses the face_recognition library built on dlib."
        ),
        "why_description": (
            "Real-time computer vision projects get the most attention in college demos "
            "and startup pitches. This directly addresses a problem every institution faces."
        ),
        "tech_stack": ["Python", "face_recognition", "OpenCV", "Streamlit", "pandas"],
        "build_plan": [
            {"step": 1, "title": "Setup", "duration_mins": 10,
             "desc": "Install face_recognition and opencv-python."},
            {"step": 2, "title": "Enrol Faces", "duration_mins": 15,
             "desc": "Upload photos of known people, compute 128-d face encodings."},
            {"step": 3, "title": "Live Recognition", "duration_mins": 20,
             "desc": "Open webcam, detect faces, compare encodings, label with name."},
            {"step": 4, "title": "Log Attendance", "duration_mins": 10,
             "desc": "Append recognised name + timestamp to CSV."},
            {"step": 5, "title": "Dashboard", "duration_mins": 5,
             "desc": "Display CSV table in Streamlit."},
        ],
        "difficulty": "intermediate",
        "ai_domains": ["CV"],
        "suitable_goals": ["Startup", "Internship"],
    },
    {
        "id": "news-summarizer",
        "title": "News Article Summarizer",
        "description": (
            "Build a tool that fetches any news article URL and returns a clean, "
            "concise 3-sentence summary using a pre-trained summarisation model."
        ),
        "why_description": (
            "Summarisation is one of the most practical NLP applications. "
            "This project is fast to build, easy to demo, and immediately useful — "
            "a winning combination for your portfolio."
        ),
        "tech_stack": ["Python", "Streamlit", "HuggingFace Transformers", "newspaper3k"],
        "build_plan": [
            {"step": 1, "title": "Setup", "duration_mins": 5,
             "desc": "Install streamlit, transformers, newspaper3k."},
            {"step": 2, "title": "Article Scraper", "duration_mins": 10,
             "desc": "Use newspaper3k to extract article text from any URL."},
            {"step": 3, "title": "Summarise", "duration_mins": 10,
             "desc": "HuggingFace pipeline('summarization', model='sshleifer/distilbart-cnn-12-6')."},
            {"step": 4, "title": "UI", "duration_mins": 20,
             "desc": "URL input, spinner while loading, show original snippet vs summary side by side."},
            {"step": 5, "title": "Deploy", "duration_mins": 15,
             "desc": "Streamlit Cloud deployment."},
        ],
        "difficulty": "beginner",
        "ai_domains": ["NLP"],
        "suitable_goals": ["Placement", "Internship", "Learning", "Startup"],
    },
    {
        "id": "price-predictor",
        "title": "House Price Predictor",
        "description": (
            "Build a regression model that predicts house prices from features "
            "like area, location, bedrooms, and age. Uses the classic Boston or "
            "Ames Housing dataset with a clean Streamlit UI."
        ),
        "why_description": (
            "Regression is the foundation of ML. Every data scientist interview "
            "touches on this topic. A working, deployed predictor shows you understand "
            "the full pipeline."
        ),
        "tech_stack": ["Python", "scikit-learn", "pandas", "Streamlit", "Plotly"],
        "build_plan": [
            {"step": 1, "title": "Load Dataset", "duration_mins": 10,
             "desc": "Load Ames Housing CSV, explore with df.describe()."},
            {"step": 2, "title": "Preprocess", "duration_mins": 15,
             "desc": "Handle nulls, encode categoricals, select top features."},
            {"step": 3, "title": "Train Model", "duration_mins": 15,
             "desc": "XGBoost or Random Forest, evaluate with RMSE and R²."},
            {"step": 4, "title": "Prediction UI", "duration_mins": 10,
             "desc": "Sliders for each input feature, instant price prediction output."},
            {"step": 5, "title": "Visualise & Deploy", "duration_mins": 10,
             "desc": "Plotly scatter of actual vs predicted prices, Streamlit Cloud."},
        ],
        "difficulty": "beginner",
        "ai_domains": ["ML"],
        "suitable_goals": ["Learning", "Placement"],
    },
    {
        "id": "youtube-qa",
        "title": "YouTube Video Q&A Bot",
        "description": (
            "Build a bot that lets you ask questions about any YouTube video. "
            "Extracts the transcript, chunks it, and answers questions using "
            "semantic search over the transcript text."
        ),
        "why_description": (
            "RAG (Retrieval Augmented Generation) is the hottest AI architecture right now. "
            "Building this project puts you ahead of 95% of candidates who only know basic ML."
        ),
        "tech_stack": ["Python", "Streamlit", "youtube-transcript-api", "scikit-learn", "sentence-transformers"],
        "build_plan": [
            {"step": 1, "title": "Setup", "duration_mins": 5,
             "desc": "Install youtube-transcript-api, sentence-transformers, streamlit."},
            {"step": 2, "title": "Fetch Transcript", "duration_mins": 10,
             "desc": "Use YouTubeTranscriptApi.get_transcript(video_id) to get full text."},
            {"step": 3, "title": "Chunk & Embed", "duration_mins": 15,
             "desc": "Split into 200-word chunks, encode each with sentence-transformers."},
            {"step": 4, "title": "Q&A Retrieval", "duration_mins": 15,
             "desc": "Encode user question, find top-3 chunks by cosine similarity, display as answer."},
            {"step": 5, "title": "UI & Deploy", "duration_mins": 15,
             "desc": "URL input + chat-style Q&A interface, deploy on Streamlit Cloud."},
        ],
        "difficulty": "intermediate",
        "ai_domains": ["NLP"],
        "suitable_goals": ["Startup", "Internship"],
    },
]

# Index by id for O(1) lookup
PROJECT_MAP = {p["id"]: p for p in PROJECTS}
