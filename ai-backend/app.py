from flask import Flask, request, jsonify
from flask_cors import CORS  # ADD THIS
from deepfake_model import detect_image, detect_video
import os

app = Flask(__name__)
CORS(app)  # ADD THIS

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return "VERIFYE AI running"


# -------- DETECT ENDPOINT ----------
@app.route("/detect", methods=["POST"])
def detect():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"})

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No selected file"})

        # save file
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        filename = file.filename.lower()
        print("Received file:", filename)


        # IMAGE
        if filename.endswith((".jpg", ".jpeg", ".png", ".webp")):
            result = detect_image(filepath)

        # VIDEO
        elif filename.endswith((".mp4", ".mov", ".avi", ".mkv")):
            result = detect_video(filepath)

        else:
            return jsonify({"error": "Unsupported file format"})

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)})





if __name__ == "__main__":
    app.run(debug=True)
