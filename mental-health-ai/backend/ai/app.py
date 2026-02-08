from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Import routes
from routes.analyze import analyze_bp

app.register_blueprint(analyze_bp, url_prefix='/api')

@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'MindGuard AI Backend'}), 200

if __name__ == '__main__':
    PORT = os.getenv('PORT', 5000)
    app.run(debug=True, port=int(PORT))
