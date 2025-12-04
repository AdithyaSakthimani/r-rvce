import json
import datetime
from flask import request, jsonify
from utils.mongo_util import mongo_util


class Behavior_Service:

    @staticmethod
    def track_behavior():
        data = request.json
        email = data.get("email")
        time_interval = data.get("time_interval")

        if not email or time_interval is None:
            return jsonify({"error": "email and time_interval required"}), 400

        # Create a new log entry
        entry = {
            "time_interval": time_interval,
            "timestamp": datetime.datetime.now()
        }

        # Try updating existing user
        updated = mongo_util.update_one(
            "behavior_logs",
            {"email": email},
            {"$push": {"patterns": entry}}
        )

        # If user not found → create a new document
        if updated.matched_count == 0:
            new_doc = {
                "email": email,
                "patterns": [entry]
            }
            mongo_util.insert_one("behavior_logs", new_doc)

        return jsonify({"message": "behavior logged successfully"}), 201

    @staticmethod
    def graph_behavior():
        data = request.json
        email = data.get("email")

        if not email:
            return jsonify({"error": "email required"}), 400

        # Get user's behavior document
        user_log = mongo_util.find_one("behavior_logs", {"email": email})

        if not user_log or "patterns" not in user_log:
            return jsonify({"error": "no data found"}), 404

        patterns = user_log["patterns"]

        # Extract intervals
        intervals = [p["time_interval"] for p in patterns]

        # Build cumulative average
        cumulative_avg = []
        running_sum = 0

        for i, val in enumerate(intervals):
            running_sum += val
            cumulative_avg.append(running_sum / (i + 1))

        x = list(range(1, len(cumulative_avg) + 1))

        return jsonify({"x": x, "y": cumulative_avg}), 200


    @staticmethod
    def score_behavior():
        data = request.json
        email = data.get("email")

        if not email:
            return jsonify({"error": "email required"}), 400

        # Get user document
        user_log = mongo_util.find_one("behavior_logs", {"email": email})

        if not user_log or "patterns" not in user_log:
            return jsonify({"error": "no data found"}), 404

        intervals = [p["time_interval"] for p in user_log["patterns"]]

        if len(intervals) == 0:
            return jsonify({"error": "no intervals recorded"}), 400

        avg = sum(intervals) / len(intervals)
        variance = sum((x - avg) ** 2 for x in intervals) / len(intervals)
        std_dev = variance ** 0.5

        # Simple behavior score formula
        score = max(0, 100 - std_dev)

        return jsonify({
            "email": email,
            "avg_interval": avg,
            "variance": variance,
            "std_dev": std_dev,
            "score": round(score, 2),
            "total_samples": len(intervals)
        }), 200
