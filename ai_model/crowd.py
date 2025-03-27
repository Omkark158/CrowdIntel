# import cv2
# import os
# import numpy as np
# import socketio
# from flask import Flask, Response, request, jsonify
# from ultralytics import YOLO
# import time
# import threading

# # ✅ Initialize Flask App for Video Streaming
# app = Flask(__name__)

# # ✅ Initialize Socket.io Client
# sio = socketio.Client()

# # ✅ Connect to WebSocket Server
# SERVER_URL = "http://localhost:5000"
# try:
#     sio.connect(SERVER_URL, transports=["websocket"])
#     print("✅ Connected to WebSocket Server")
# except Exception as e:
#     print("❌ WebSocket Connection Failed:", e)
#     exit()

# # ✅ Load YOLO Model
# model = YOLO("yolov8n.pt")  

# # ✅ Change Video Source to Laptop Webcam
# cap = cv2.VideoCapture(0)  
# if not cap.isOpened():
#     print("❌ Error: Could not open the laptop camera!")
#     exit()

# running = True  # ✅ Control flag to stop the camera safely

# # ✅ Flask Route for Video Streaming
# def generate_frames():
#     global running
#     while running:
#         ret, frame = cap.read()
#         if not ret:
#             print("❌ Camera not found or turned off!")
#             break  

#         # ✅ Run YOLO Detection
#         results = model.predict(frame, save=False, conf=0.4, iou=0.5)
#         people_count = sum(1 for box in results[0].boxes if int(box.cls[0]) == 0)

#         # ✅ Send Data via WebSocket
#         data = {
#             "video_source": "Laptop Camera",
#             "location": "Local Device",
#             "people_count": people_count,
#             "density": round((people_count / 10) * 100, 2),
#             "unusual_movement": people_count > 10
#         }
#         try:
#             sio.emit("update_dashboard", data)
#         except Exception as e:
#             print("❌ WebSocket Emit Failed:", e)

#         # ✅ Encode frame as JPEG for streaming
#         _, buffer = cv2.imencode('.jpg', frame)
#         frame_bytes = buffer.tobytes()

#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# @app.route('/video_feed')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# # ✅ Stop the Model & Camera When Requested
# @app.route('/stop', methods=['POST'])
# def stop_camera():
#     global running, cap
#     running = False
#     cap.release()
#     cv2.destroyAllWindows()
#     print("❌ Camera and Model Stopped Successfully")
#     return jsonify({"message": "Camera and Model Stopped"}), 200

# # ✅ Run Flask App
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5001, debug=False)








import cv2
import os
import numpy as np
import socketio
from flask import Flask, Response, request, jsonify
from ultralytics import YOLO
import time

# ✅ Initialize Flask App for Video Streaming
app = Flask(__name__)

# ✅ Initialize Socket.io Client
sio = socketio.Client()

# ✅ WebSocket Server URL
SERVER_URL = "http://localhost:5000"

# ✅ Attempt WebSocket Connection (with retry)
max_retries = 5
retry_count = 0
connected = False

while retry_count < max_retries and not connected:
    try:
        sio.connect(SERVER_URL, transports=["websocket"])
        print("✅ Connected to WebSocket Server")
        connected = True
    except Exception as e:
        retry_count += 1
        print(f"⚠️ WebSocket Connection Failed ({retry_count}/{max_retries}):", e)
        time.sleep(2)

if not connected:
    print("❌ WebSocket connection failed after retries. Running in offline mode.")
    sio = None  

# ✅ Load YOLO Model
model = YOLO("yolov8n.pt")

# ✅ Try Different Camera Sources
cap = None
for index in [0, 1]:
    cap = cv2.VideoCapture(index)
    if cap.isOpened():
        print(f"✅ Camera {index} detected and opened successfully!")
        break

if not cap or not cap.isOpened():
    print("⚠️ No available camera found! Using test video instead.")
    cap = cv2.VideoCapture("test_video.mp4")

if not cap.isOpened():
    print("❌ Error: Could not open the camera or video source!")
    exit()

running = True  # ✅ Control flag to stop the camera safely

# ✅ Flask Route for Video Streaming
def generate_frames():
    global running, cap
    while running:
        ret, frame = cap.read()
        if not ret or frame is None:
            print("⚠️ Camera feed not available!")
            break

        # ✅ Run YOLO Detection on Frame
        results = model.predict(frame, save=False, conf=0.4, iou=0.5)
        
        people_count = 0  
        if results:
            for result in results:
                for box in result.boxes:
                    class_id = int(box.cls[0])
                    if class_id == 0:  # Class 0 is 'person'
                        people_count += 1

        # ✅ Compute Correct Density
        frame_area = frame.shape[0] * frame.shape[1]  # Frame size in pixels
        max_people_threshold = 50  # Adjust based on actual scenario
        density = round((people_count / max_people_threshold) * 100, 2)
        density = min(density, 100)  # Ensure it does not exceed 100%

        # ✅ Define Congestion Level
        if density < 30:
            congestion_level = "Low"
        elif 30 <= density < 70:
            congestion_level = "Moderate"
        else:
            congestion_level = "High"

        unusual_activity = people_count > 10

        # ✅ Send Data via WebSocket
        data = {
            "video_source": "Camera" if cap.isOpened() else "Test Video",
            "location": "Local Device",
            "people_count": people_count,
            "density": density,
            "unusual_movement": unusual_activity,
            "congestion_level": congestion_level,
            "peak_time": time.strftime("%H:%M:%S")
        }

        print(f"📊 Data Sent: {data}")

        if sio:
            try:
                sio.emit("update_dashboard", data)  
            except Exception as e:
                print("⚠️ WebSocket Emit Failed:", e)

        # ✅ Encode frame as JPEG for streaming
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# ✅ Stop the Model & Camera When Requested
@app.route('/stop', methods=['POST'])
def stop_camera():
    global running, cap
    running = False
    if cap:
        cap.release()
    cv2.destroyAllWindows()
    print("✅ Camera and Model Stopped Successfully")
    return jsonify({"message": "Camera and Model Stopped"}), 200

# ✅ Run Flask App
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False)




# import cv2
# import socketio
# from flask import Flask, Response, request, jsonify
# from ultralytics import YOLO
# import time

# # ✅ Initialize Flask & Socket.io
# app = Flask(__name__)
# sio = socketio.Client()
# SERVER_URL = "http://localhost:5000"

# # ✅ Connect to WebSocket Server
# try:
#     sio.connect(SERVER_URL)
#     print("✅ Connected to WebSocket Server")
# except Exception as e:
#     print("❌ WebSocket Connection Failed:", e)
#     exit()

# # ✅ Load YOLO Model
# model = YOLO("yolov8n.pt")
# running = False
# cap = None

# # ✅ Function to Start the Camera
# def start_camera():
#     global cap, running
#     if running:
#         return {"message": "Camera is already running"}, 400

#     print("🚀 Initializing Webcam...")
#     cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)  # ✅ Force DirectShow (Windows)
#     cap.set(cv2.CAP_PROP_FPS, 30)  # ✅ Improve speed
#     cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)  # ✅ Set lower resolution for faster startup
#     cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

#     if not cap.isOpened():
#         print("❌ Error: Could not access the laptop webcam!")
#         return {"message": "Camera initialization failed"}, 500

#     running = True
#     print("✅ Camera started successfully!")

#     return {"message": "Camera started"}, 200

# # ✅ Flask Route to Start the Camera
# @app.route('/start', methods=['POST'])
# def start():
#     response, status_code = start_camera()
#     return jsonify(response), status_code

# # ✅ Flask Route to Stop the Camera
# @app.route('/stop', methods=['POST'])
# def stop():
#     global cap, running
#     running = False
#     if cap:
#         cap.release()
#     cv2.destroyAllWindows()
#     print("❌ Camera stopped!")
#     return jsonify({"message": "Camera stopped"}), 200

# # ✅ Flask Route for Video Streaming
# @app.route('/video_feed')
# def video_feed():
#     def generate_frames():
#         global running
#         while running:
#             ret, frame = cap.read()
#             if not ret:
#                 print("❌ Error reading frame from webcam!")
#                 stop()
#                 break

#             # ✅ Run YOLO Detection
#             results = model.predict(frame, save=False, conf=0.4, iou=0.5)
#             people_count = sum(1 for box in results[0].boxes if int(box.cls[0]) == 0)

#             # ✅ Send Data via WebSocket
#             data = {
#                 "peopleCount": people_count,
#                 "density": round((people_count / 10) * 100, 2),
#                 "unusual": "Yes" if people_count > 7 else "No",
#                 "peakTime": time.strftime("%H:%M:%S"),
#                 "congestionLevel": "High" if people_count > 7 else "Medium" if people_count > 3 else "Low"
#             }
#             try:
#                 sio.emit("update_dashboard", data)
#                 print("📡 Data Sent:", data)
#             except Exception as e:
#                 print("❌ WebSocket Emit Failed:", e)

#             # ✅ Encode frame as JPEG for streaming
#             _, buffer = cv2.imencode('.jpg', frame)
#             frame_bytes = buffer.tobytes()
#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# # ✅ Start Flask Server
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5001, debug=True, threaded=True)
