#from init import create_app
import flask
from controllers.login import login_bp
app = flask.Flask(__name__)
app.register_blueprint(login_bp, url_prefix="/login")
if __name__=="__main__":
    app.run(debug = True)
