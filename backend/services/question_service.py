from flask import request, jsonify
from utils.mongo_util import mongo_util as mongo


class QuestionService:

    @staticmethod
    def create_test():
        data = request.get_json()
        testname = data.get("testname", "").strip()

        if testname == "":
            return jsonify({"error": "testname is required"}), 400

        mongo.insert_one("assessments", {
            "_id": testname,
            "questions": []
        })

        return jsonify({"message": "Test created", "testname": testname}), 201

    @staticmethod
    def create_question():
        data = request.get_json()

        testname = data.get("testname", "").strip()
        question_text = data.get("question", "")
        testcases = data.get("testcases", [])
        output = data.get("output", "")

        if not testname or not question_text:
            return jsonify({"error": "testname and question are required"}), 400

        question_obj = {
            "text": question_text,
            "testcases": testcases,
            "output": output
        }

        # Push question into the array
        mongo.update_one(
            "assessments",
            {"_id": testname},
            {"$push": {"questions": question_obj}}
        )

        return jsonify({"message": "Question added", "testname": testname}), 201

    @staticmethod
    def get_test_questions(testname):
        data = mongo.find_one("assessments", {"_id": testname})
        if data:
            return jsonify(data)
        return jsonify({"error": "Test not found"}), 404
