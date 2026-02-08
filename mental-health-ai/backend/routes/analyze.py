from flask import Blueprint, request, jsonify
import re

analyze_bp = Blueprint('analyze', __name__)

NEGATIVE_KEYWORDS = [
    'tired', 'stressed', 'anxious', 'hopeless', 'alone', 'depressed', 'worthless', 'crying', 'insomnia'
]

CRITICAL_KEYWORDS = ['suicide', 'kill', 'die', 'end it all']

@analyze_bp.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        text = data.get('text') if data else None
        
        if not text or not isinstance(text, str) or len(text.strip()) == 0:
            return jsonify({'error': 'Invalid input: text is required.'}), 400
        
        normalized = text.lower()
        score = 30  # base score
        signals = []
        
        # Check for negative keywords
        for kw in NEGATIVE_KEYWORDS:
            pattern = r'\b' + re.escape(kw) + r'\b'
            matches = re.findall(pattern, normalized)
            if matches:
                score += 10 * len(matches)
                signals.append(kw)
        
        # Check for critical keywords
        for kw in CRITICAL_KEYWORDS:
            pattern = r'\b' + re.escape(kw) + r'\b'
            matches = re.findall(pattern, normalized)
            if matches:
                score += 20 * len(matches)
                signals.append(kw)
        
        # Cap at 100
        if score > 100:
            score = 100
        
        # Remove duplicates
        signals = list(set(signals))
        
        # Determine message
        if score >= 70:
            message = 'High risk — immediate attention recommended.'
        elif score >= 40:
            message = 'Moderate risk — monitor and consider support.'
        else:
            message = 'Low to moderate risk.'
        
        return jsonify({
            'riskScore': score,
            'signals': signals,
            'message': message
        }), 200
        
    except Exception as err:
        print('Analyze error:', err)
        return jsonify({'error': 'Server error'}), 500
