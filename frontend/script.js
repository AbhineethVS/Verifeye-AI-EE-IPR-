console.log("NEW SCRIPT RUNNING");

// SCROLL TO UPLOAD
function scrollToUpload() {
	document.getElementById("upload").scrollIntoView({ behavior: "smooth" });
}

// FILE HANDLING
function handleFile(input) {
	if (input.files && input.files[0]) {
		const file = input.files[0];

		// allow images AND videos
		const allowedTypes = ["image/", "video/"];
		const isAllowed = allowedTypes.some((type) =>
			file.type.startsWith(type),
		);

		if (!isAllowed) {
			alert("Only image or video files are supported.");
			input.value = "";
			return;
		}

		const preview = document.getElementById("file-preview");
		const fileName = document.getElementById("file-name");
		const dropZone = document.getElementById("dropZone");

		fileName.textContent = file.name;
		preview.style.display = "block";
		dropZone.style.display = "none";
		document.getElementById("result").style.display = "none";
	}
}

function removeFile() {
	document.getElementById("fileInput").value = "";
	document.getElementById("file-preview").style.display = "none";
	document.getElementById("dropZone").style.display = "block";
	document.getElementById("result").style.display = "none";
}

// DRAG AND DROP
const dropZone = document.getElementById("dropZone");

dropZone.addEventListener("dragover", (e) => {
	e.preventDefault();
	dropZone.style.borderColor = "rgba(0,245,212,0.6)";
	dropZone.style.background = "rgba(0,245,212,0.06)";
});

dropZone.addEventListener("dragleave", () => {
	dropZone.style.borderColor = "";
	dropZone.style.background = "";
});

dropZone.addEventListener("drop", (e) => {
	e.preventDefault();
	dropZone.style.borderColor = "";
	dropZone.style.background = "";
	const file = e.dataTransfer.files[0];
	if (file) {
		const fileInput = document.getElementById("fileInput");
		const dt = new DataTransfer();
		dt.items.add(file);
		fileInput.files = dt.files;
		handleFile(fileInput);
	}
});

// DETECT FAKE
// REAL AI DETECTION (connects to backend)
async function detectFake() {
	const fileInput = document.getElementById("fileInput");
	const result = document.getElementById("result");
	const btnText = document.querySelector(".btn-text");
	const btnLoader = document.querySelector(".btn-loader");
	const btn = document.getElementById("analyzeBtn");

	if (!fileInput.files.length) {
		result.innerHTML = "Upload a file first.";
		result.style.display = "block";
		return;
	}

	btnText.style.display = "none";
	btnLoader.style.display = "flex";
	btn.disabled = true;

	const formData = new FormData();
	formData.append("file", fileInput.files[0]);

	try {
		// CORRECT
		const res = await fetch("http://127.0.0.1:5000/detect", {
			method: "POST",
			body: formData,
		});

		const data = await res.json();

		console.log("Server response:", data); // debug

		result.style.display = "block";

		if (data.error) {
			result.innerHTML = "❌ " + data.error;
		} else {
			// CORRECT
			const label = data.label;
			const confidence = data.confidence; // already a %, no multiplication needed
			result.innerHTML = `<strong>${label}</strong><br>Confidence: ${confidence}%`;

			result.innerHTML = `
				<strong>${label}</strong><br>
				Confidence: ${confidence}%
			`;
		}
	} catch (err) {
		console.log(err);
		result.innerHTML = "Server error — check backend";
		result.style.display = "block";
	}

	btnText.style.display = "inline";
	btnLoader.style.display = "none";
	btn.disabled = false;
}

// NAVBAR SCROLL EFFECT
window.addEventListener("scroll", () => {
	const nav = document.getElementById("navbar");
	if (window.scrollY > 60) {
		nav.style.padding = "12px 60px";
		nav.style.boxShadow = "0 4px 40px rgba(0,0,0,0.5)";
	} else {
		nav.style.padding = "18px 60px";
		nav.style.boxShadow = "none";
	}
});

// INTERSECTION OBSERVER - Fade in on scroll
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = "1";
				entry.target.style.transform = "translateY(0)";
			}
		});
	},
	{ threshold: 0.1 },
);

document
	.querySelectorAll(".step-card, .feature-item, .pricing-card")
	.forEach((el) => {
		el.style.opacity = "0";
		el.style.transform = "translateY(24px)";
		el.style.transition =
			"opacity 0.5s ease, transform 0.5s ease, border-color 0.3s, box-shadow 0.3s";
		observer.observe(el);
	});

// attach click event safely
document.getElementById("analyzeBtn").addEventListener("click", function (e) {
	e.preventDefault();
	e.stopPropagation(); // stops weird reload behavior
	detectFake();
});
