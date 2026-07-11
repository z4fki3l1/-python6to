from flask import Flask, flash, render_template, request, redirect, url_for, jsonify
from flask_mysqldb import MySQL
from flask_wtf import CSRFProtect
from werkzeug.security import generate_password_hash
from flask_login import LoginManager, login_user, logout_user, login_required
import os
from src.config import config



from config import config

from models.ModelUser import ModelUser

from models.entities.User import User

app = Flask(__name__)

enviroment = config[os.environ.get('FLASK_ENV', 'development')]
app.config.from_object(enviroment)

db = MySQL(app)
login_manager_app = LoginManager(app)
csrf = CSRFProtect()

@login_manager_app.user_loader
def load_user(id):
    return ModelUser.get_by_id(db, id)

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/productos')
@login_required
def productos():
    return render_template('productos.html')

@app.route('/editar-cliente/<id>')
@login_required
def editarCliente(id):
    return render_template('editar-cliente.html', id = id)

@app.route('/clientes')
@login_required
def clientes():
    
    cur = db.connection.cursor()
    cur.execute("SELECT * FROM cliente")
    clientesDB = cur.fetchall() 
    return render_template('clientes.html', Clientes = clientesDB)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # print(request.form['nombre'])
        # print(request.form['password'])
        user = User(0, request.form['username'], request.form['password'])
        logged_user = ModelUser.login(db, user)
        if logged_user != None:
            if logged_user.password:
                login_user(logged_user)
                return redirect(url_for('home'))
            else:
                flash('Contraseña incorrecta')
                return render_template('auth/login.html')
        else:
            flash('Usuario no encontrado')
            return render_template('auth/login.html')
    else:
        return render_template('auth/login.html')
    
@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/home')
@login_required
def home():
    return render_template('home.html')

@app.route('/protegida')
@login_required
def protegida():
    return "<h1>Esta es una vista protegida, solo para usuarios autenticados</h1>"

def status_401(error):
    return redirect(url_for('login'))

def status_404(error):
    return "<h1>Página no encontrada</h1>", 404


@app.route('/crear-usuario', methods=['POST'])
@csrf.exempt
def crearUsuario():
    try:
        username = request.form.get('nombre')
        password = request.form.get('password')
        fullname = request.form.get('fullname')
        hashed = generate_password_hash(password) if password else ''
        cur = db.connection.cursor()
        sql = "INSERT INTO cliente (username,password,fullname,lActivo) VALUES (%s,%s,%s,1)"
        cur.execute(sql, (username, hashed, fullname))
        db.connection.commit()
        return jsonify(Resultado="Usuario creado", Exito=True)
    except Exception as ex:
        return jsonify(Resultado=str(ex), Exito=False)


@app.route('/actualizar-usuario', methods=['POST'])
@csrf.exempt
def actualizarUsuario():
    try:
        id = request.form.get('id')
        username = request.form.get('nombre')
        password = request.form.get('password')
        fullname = request.form.get('fullname')
        cur = db.connection.cursor()
        if password:
            hashed = generate_password_hash(password)
            sql = "UPDATE cliente SET username=%s, password=%s, fullname=%s WHERE id=%s"
            cur.execute(sql, (username, hashed, fullname, id))
        else:
            sql = "UPDATE cliente SET username=%s, fullname=%s WHERE id=%s"
            cur.execute(sql, (username, fullname, id))
        db.connection.commit()
        return jsonify(Resultado="Usuario actualizado", Exito=True)
    except Exception as ex:
        return jsonify(Resultado=str(ex), Exito=False)


@app.route('/eliminar-usuario', methods=['POST'])
@csrf.exempt
def eliminarUsuario():
    try:
        id = request.form.get('id')
        cur = db.connection.cursor()
        sql = "UPDATE cliente SET lActivo=0 WHERE id=%s"
        cur.execute(sql, (id,))
        db.connection.commit()
        return jsonify(Resultado="Usuario eliminado", Exito=True)
    except Exception as ex:
        return jsonify(Resultado=str(ex), Exito=False)


if __name__ == '__main__':
    app.config.from_object(config['development'])
    csrf.init_app(app)
    app.register_error_handler(401, status_401)
    app.register_error_handler(404, status_404)
    app.run()