from flask import Flask, jsonify
from flask_cors import CORS

from app.utils.response_util import api_response


def create_app():
    app = Flask(__name__)
    CORS(app, origins="*")

    from app.controllers.login import calendar_bp
    app.register_blueprint(calendar_bp, url_prefix="/calendar")

    @app.route("/")
    def root():
        return jsonify({"message": "Welcome to the Pepsales !TP!"})
    
    @app.route("/health")
    def health_check():
        return jsonify({"message": "Health is okay"})
        
    @app.errorhandler(404)
    def page_not_found(error):
        return api_response(404, 'The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.')  

    return app

