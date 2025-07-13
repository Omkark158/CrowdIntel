import eventlet
eventlet.monkey_patch()

import cv2
import numpy as np
import time
from flask import Flask, Response, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet", ping_timeout=60, ping_interval=25)

model = YOLO("yolov8n.pt")

cap = None
for index in range(5):
    temp_cap = cv2.VideoCapture(index)
    if temp_cap.isOpened():
        print(f"✅ Camera {index} detected!")
        cap = temp_cap
        break
    temp_cap.release()

if not cap or not cap.isOpened():
    print("⚠️ No camera found, using test video.")
    cap = cv2.VideoCapture("test_video.mp4")

if not cap.isOpened():
    print("❌ Error: No valid video source!")
    exit()

running = True
last_emit_time = time.time()

def generate_frames():
    global running, cap, last_emit_time
    while running:
        ret, frame = cap.read()
        if not ret or frame is None:
            print("⚠️ No frame received! Retrying...")
            continue

        frame = cv2.resize(frame, (640, 480))

        results = model.predict(frame, imgsz=480, conf=0.4, iou=0.5, device="cpu")
        people_count = sum(1 for result in results for box in result.boxes if int(box.cls[0]) == 0)

        for result in results:
            for box in result.boxes:
                if int(box.cls[0]) == 0:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    
                    # 🔵 Make bounding box **narrower but taller**
                    x_center = (x1 + x2) // 2
                    width = (x2 - x1) // 3  # Reduce width
                    x1, x2 = x_center - width, x_center + width
                    
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        max_people_threshold = 50
        density = round((people_count / max_people_threshold) * 100, 2)
        density = min(density, 100)

        congestion_level = "Low" if density < 30 else "Moderate" if density < 70 else "High"
        unusual_activity = people_count > 10

        data_to_emit = {
            "people_count": people_count,
            "density": density,
            "unusual_movement": unusual_activity,
            "congestion_level": congestion_level,
            "peak_time": time.strftime("%H:%M:%S"),
        }

        # 🔴 Reduce WebSocket latency (send every 0.3s)
        if time.time() - last_emit_time > 0.3:
            print(f"📡 Sending Data: {data_to_emit}")
            socketio.emit("update_dashboard", data_to_emit, namespace="/")
            last_emit_time = time.time()

        socketio.sleep(0.05)  # 🔴 Reduce latency further

        _, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/video_feed')
def video_feed():
    response = Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

@app.route('/start', methods=['POST'])
def start_camera():
    global running
    running = True
    return jsonify({"status": "success", "message": "Camera started"}), 200

@app.route('/stop', methods=['POST'])
def stop_camera():
    global running, cap
    running = False
    if cap and cap.isOpened():
        cap.release()
    return jsonify({"status": "success", "message": "Camera stopped"}), 200

@socketio.on("connect")
def handle_connect():
    print("✅ WebSocket Connected")

@socketio.on("disconnect")
def handle_disconnect():
    print("❌ WebSocket Disconnected")

if __name__ == "__main__":
    print("🚀 Starting WebSocket Server...")
    socketio.run(app, host="0.0.0.0", port=5000, debug=False)
