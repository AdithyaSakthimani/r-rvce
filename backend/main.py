#from init import create_app
import flask
from controllers.login import login_bp
from controllers.compiler import compiler_bp
app = flask.Flask(__name__)
app.register_blueprint(login_bp, url_prefix="/auth")
app.register_blueprint(compiler_bp, url_prefix="/compiler")
if __name__=="__main__":
    app.run(debug = True)
