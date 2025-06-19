from flask import Flask, request, jsonify
import openai
import os
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/api/ask", methods=["POST"])
def ask():
    data = request.get_json()
    mode = data.get("mode")
    user_input = data.get("input")

    prompt_map = {
        "explain": f"Explain this topic in simple terms:\n{user_input}",
        "notes": f"Clean and organize these notes:\n{user_input}",
        "polish": f"Polish this exam answer:\n{user_input}"
    }

    if mode not in prompt_map:
        return jsonify({"error": "Invalid mode"}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": prompt_map[mode]}
            ]
        )
        return jsonify({"output": response.choices[0].message.content.strip()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
