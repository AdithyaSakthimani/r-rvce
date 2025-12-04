import json
from flask import Blueprint, request, jsonify
from services.compiler_service import Compiler_Service
compiler_bp = Blueprint("compiler", __name__)

@compiler_bp.route("/run", methods=["POST"])
def run_Code():

    return Compiler_Service.run_Code()
