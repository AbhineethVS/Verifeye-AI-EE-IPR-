# ◈ VERIFYE AI — Deepfake Detection System

> An AI-powered web application that detects deepfake images and videos using state-of-the-art machine learning models from HuggingFace Transformers.

![Status](https://img.shields.io/badge/status-demo--ready-brightgreen)
![Python](https://img.shields.io/badge/python-3.8+-blue)
![Flask](https://img.shields.io/badge/backend-flask-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📌 Overview

VERIFYE AI is a full-stack deepfake detection tool that allows users to upload an image or video and instantly receive an AI-generated verdict — **Real** or **Deepfake** — along with a confidence score percentage.

The system uses a HuggingFace transformer model running locally via a Python/Flask backend, paired with a polished browser-based frontend. No external AI API calls — everything runs on your own machine.

---

## ✨ Features

- 🖼️ **Image Detection** — Supports JPG, PNG, WEBP formats
- 🎬 **Video Detection** — Supports MP4, MOV, AVI, MKV (frame sampling via OpenCV)
- 📊 **Confidence Score** — Returns a percentage alongside the verdict
- 🎨 **Polished UI** — Dark theme with drag & drop file upload
- 🔒 **Privacy Focused** — Files are processed locally, not sent to any third-party
- ⚡ **Fast Analysis** — Image results typically in under 3 seconds

---

## 🗂️ Project Structure

```
VERIFYE/
├── frontend/
│   ├── index.html          # Main UI — landing page + upload section
│   ├── script.js           # File handling, fetch API calls, UI logic
│   └── style.css           # Full styling — dark theme, animations
│
├── ai-backend/
│   ├── app.py              # Flask server — /detect endpoint
│   ├── deepfake_model.py   # AI model loading, image & video detection
│   └── requirements.txt    # Python dependencies
│
├── .gitignore
└── README.md
```

---

## ⚙️ Tech Stack

| Layer            | Technology                               |
| ---------------- | ---------------------------------------- |
| Frontend         | HTML, CSS, JavaScript                    |
| Backend          | Python 3.8+, Flask, Flask-CORS           |
| AI Model         | HuggingFace Transformers (`pipeline`)    |
| Image Processing | Pillow (PIL)                             |
| Video Processing | OpenCV (`cv2`)                           |
| Model Used       | `prithivMLmods/Deep-Fake-Detector-Model` |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip
- A modern browser (Chrome, Firefox, Edge)

### 1. Clone the repository

```bash
git clone https://github.com/AbhineethVS/Verifeye-AI-EE-IPR-.git
cd Verifeye-AI-EE-IPR-
```

### 2. Set up the Python environment

```bash
cd ai-backend

# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Activate it (Mac/Linux)
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

> ⚠️ **Note:** First run will automatically download the AI model (~400MB). This only happens once and is cached locally.

### 4. Start the Flask backend

```bash
python app.py
```

Server starts at `http://127.0.0.1:5000`

### 5. Open the frontend

Simply open `frontend/index.html` in your browser. No separate server needed — it's plain HTML/CSS/JS.

---

## 🔌 API Reference

### `POST /detect`

Accepts a file upload and returns a deepfake detection result.

**Request**

```
Content-Type: multipart/form-data
Body: file = <image or video file>
```

**Supported Formats**

| Type  | Extensions                    |
| ----- | ----------------------------- |
| Image | `.jpg` `.jpeg` `.png` `.webp` |
| Video | `.mp4` `.mov` `.avi` `.mkv`   |

**Success Response**

```json
{
	"label": "Deepfake",
	"confidence": 94.32
}
```

**Error Response**

```json
{
	"error": "Unsupported file format"
}
```

| Field        | Type   | Description                         |
| ------------ | ------ | ----------------------------------- |
| `label`      | string | Either `"Deepfake"` or `"Real"`     |
| `confidence` | float  | Confidence percentage between 0–100 |

---

## 🤖 How Detection Works

```
User Uploads File (Image or Video)
            ↓
    Browser — HTML/CSS/JS
            ↓
  HTTP POST → Flask /detect (port 5000)
            ↓
      File Extension Check
        ↙           ↘
    Image           Video
      ↓               ↓
detect_image()   detect_video()
      ↓          (OpenCV samples 30 frames)
      ↓               ↓
   HuggingFace Transformer Model
            ↓
   JSON → { label, confidence }
            ↓
     Result displayed in UI
      ✅ Real  or  ⚠️ Deepfake
```

### Image Detection

The image is opened via PIL, converted to RGB, and passed directly to the HuggingFace classifier pipeline. Returns a label and confidence score.

### Video Detection

OpenCV opens the video and samples up to 30 frames evenly distributed across the timeline. Each frame is converted from BGR to RGB and passed to the classifier. Fake scores are averaged across all frames to produce a final verdict.

---

## ⚠️ Known Limitations

- **Video detection is experimental** — the model was trained on images, so video accuracy is lower than image accuracy
- **Diffusion-model fakes** (Midjourney, DALL-E, Stable Diffusion) may be harder to detect than GAN-based fakes
- **Processing time** — video analysis can take 10–30 seconds depending on your machine
- **Face-focused** — works best on images containing a clear human face

---

## 🧪 Testing the Detector

Good sources for test media:

| Source                                                           | Content Type                 |
| ---------------------------------------------------------------- | ---------------------------- |
| [thispersondoesnotexist.com](https://thispersondoesnotexist.com) | Fake — GAN generated faces   |
| [generated.photos](https://generated.photos)                     | Fake — AI generated faces    |
| [unsplash.com](https://unsplash.com)                             | Real — authentic photographs |
| [pexels.com](https://pexels.com)                                 | Real — authentic photographs |

---

## 🛣️ Roadmap

- [ ] Face detection + cropping before classification for improved accuracy
- [ ] Confidence heatmap overlay showing suspicious regions
- [ ] Per-frame breakdown for video analysis
- [ ] File cleanup after analysis (auto-delete from `/uploads`)
- [ ] URL-based detection (paste image link instead of uploading)
- [ ] Mobile-optimised UI
- [ ] Deploy backend to HuggingFace Spaces (permanent hosting)

---

## 🌐 Sharing / Demo

To share this project without keeping your PC on, the recommended approach is:

1. Deploy frontend to **Netlify** (free, drag and drop)
2. Deploy backend to **HuggingFace Spaces** (free, AI-friendly)
3. Update the fetch URL in `script.js` to point to your live backend

For a quick local demo on the same WiFi network, find your local IP (`ipconfig` on Windows) and update the fetch URL to `http://YOUR_LOCAL_IP:5000/detect`.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Your Name**

- GitHub: [@AbhineethVS](https://github.com/AbhineethVS)
- Project built as part of independent learning in AI & full-stack development

---

> _Built with Flask + HuggingFace Transformers. Designed to protect digital truth._
