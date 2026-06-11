const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Link Anti-DNS (Expandido para evitar errores en la escuela)
const URI = 'mongodb://a24308051280879_db_user:20090415@ac-hyfy9tj-shard-00-00.yjwti8q.mongodb.net:27017,ac-hyfy9tj-shard-00-01.yjwti8q.mongodb.net:27017,ac-hyfy9tj-shard-00-02.yjwti8q.mongodb.net:27017/clinic_mex?ssl=true&replicaSet=atlas-b44g7w-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(URI)
  .then(() => console.log('Conexión exitosa a MongoDB (Consultorio OVC)'))
  .catch(err => console.error('Fallo al conectar:', err));

// Esquemas y Modelos
const Paciente = mongoose.model('Paciente', new mongoose.Schema({
    curp: String, nombre: String, apellido: String, fecha_nac: String,
    genero: String, telefono: String, email: String, direccion: String,
    tipo_sangre: String, fecha_reg: String
}), 'pacientes');

const Medico = mongoose.model('Medico', new mongoose.Schema({
    nombre: String, apellido: String, especialidad: String,
    telefono: String, email: String, cedula: String, horario: String
}), 'medicos');

const Inventario = mongoose.model('Inventario', new mongoose.Schema({
    nombre: String, descripcion: String, laboratorio: String,
    existencia: Number, precio: String
}), 'inventarios');

const Cita = mongoose.model('Cita', new mongoose.Schema({
    curp_paciente: String, id_medico: String, fecha: String,
    hora: String, motivo: String, estado: String
}), 'citas');

const Pago = mongoose.model('Pago', new mongoose.Schema({
    id_cita: String, monto: String, metodo_pago: String,
    fecha_pago: String, estado_pago: String
}), 'pagos');

// Utilidad para crear rutas CRUD
function crearRutas(app, rutaBase, Modelo) {
    app.get(rutaBase, (req, res) => Modelo.find().then(d => res.json(d)));
    app.post(rutaBase, (req, res) => new Modelo(req.body).save().then(d => res.json(d)));
    app.put(`${rutaBase}/:id`, (req, res) => Modelo.findByIdAndUpdate(req.params.id, req.body).then(() => res.json({ok: 1})));
    app.delete(`${rutaBase}/:id`, (req, res) => Modelo.findByIdAndDelete(req.params.id).then(() => res.json({ok: 1})));
}

crearRutas(app, '/api/pacientes', Paciente);
crearRutas(app, '/api/medicos', Medico);
crearRutas(app, '/api/inventario', Inventario);
crearRutas(app, '/api/citas', Cita);
crearRutas(app, '/api/pagos', Pago);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`Servidor de OVC activo en puerto ${PORT}`));
