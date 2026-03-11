from transformers import pipeline
from PIL import Image
import cv2

print("Loading deepfake model... (first run takes time)")

# PUBLIC working model (no login required)
classifier = pipeline(
    "image-classification",
    model="prithivMLmods/Deep-Fake-Detector-Model"
)

print("Model loaded successfully!")

# ---------- IMAGE DETECTION ----------
from PIL import Image

def detect_image(filepath):
    try:
        # open image properly
        image = Image.open(filepath).convert("RGB")

        result = classifier(image)[0]

        return {
            "label": result["label"],
            "confidence": round(result["score"] * 100, 2)
        }

    except Exception as e:
        return {"error": str(e)}



# ---------- VIDEO DETECTION ----------
def detect_video(path):

    cap = cv2.VideoCapture(path)
    frames_checked = 0
    fake_score = 0

    while cap.isOpened() and frames_checked < 30:
        ret, frame = cap.read()
        if not ret:
            break

        image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        result = classifier(image)

        if "fake" in result[0]["label"].lower():
            fake_score += result[0]["score"]

        frames_checked += 1

    cap.release()

    confidence = fake_score / max(frames_checked, 1)

    # CORRECT
    if confidence > 0.5:
        return {"label": "Deepfake", "confidence": round(confidence * 100, 2)}
    else:
        return {"label": "Real", "confidence": round((1 - confidence) * 100, 2)}
