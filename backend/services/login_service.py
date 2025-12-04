import json
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from utils.mongo_util import mongo_util


class Login_Service:

    @staticmethod
    def signup():
        data = request.json

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        is_test_creator = data.get("creator")

        if not username or not email or not password:
            return jsonify({"error": "username, email & password required"}), 400

        # Check if email already exists
        existing_user = mongo_util.find_one("users", {"email": email})
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409

        # Also optionally check username uniqueness
        existing_username = mongo_util.find_one("users", {"username": username})
        if existing_username:
            return jsonify({"error": "Username already taken"}), 409

        hashed_pw = generate_password_hash(password)

        user_data = {
            "username": username,
            "email": email,
            "password": hashed_pw , 
            "test_creator":is_test_creator
        }
        user_data = mongo_util.add_timestamps_on_insert(user_data)

        mongo_util.insert_one("users", user_data)

        return jsonify({"message": "User created successfully"}), 201

    @staticmethod
    def login():
        data = request.json

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "email & password required"}), 400

        # Find user by email
        user = mongo_util.find_one("users", {"email": email})
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # Validate password
        if not check_password_hash(user["password"], password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        is_creator = user.get("test_creator")

        return jsonify({"message": "Login successful" , "is_test_creater":is_creator}), 200
