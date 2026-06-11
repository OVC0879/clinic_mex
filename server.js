const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- AQUÍ VA TU CADENA DE CONEXIÓN REAL ---
// RECUERDA: Cambia <password> por tu contraseña y quita los símbolos < >
const MONGO_URI = "mongodb://atlas-sql-6a2a769ae76cd6a0fba1e934-d3uovb.a.query.mongodb.net/clinic_mex?ssl=true&authSource=admin";

mongoose.connect(MONGO_URI)
  .then(() => console.log("¡Conectado exitosamente a MongoDB!"))
  .catch(err => console.error("Error al conectar:", err));

// Definición del esquema (contrato de los datos)
const Paciente = mongoose.model('Paciente', new mongoose.Schema({
  nombre: String,
  edad: String,
  sexo: String,
  ocupacion: String,
  diagnostico: String,
  tratamiento: String
}));

// Ruta para recibir los datos del formulario
app.post('/api/pacientes', async (req, res) => {
  try {
    const nuevoPaciente = new Paciente(req.body);
    await nuevoPaciente.save();
    res.json({ mensaje: "Paciente guardado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar en la BD" });
  }
});

app.listen(5000, () => console.log("Servidor escuchando en puerto 5000"));

async function enviarDatos() {
    // Obtenemos los valores de los inputs
    const datos = {
      nombre: document.getElementById("nombre").value,
      edad: document.getElementById("edad").value,
      sexo: document.getElementById("sexo").value,
      ocupacion: document.getElementById("ocupacion").value,
      diagnostico: document.getElementById("diagnostico").value,
      tratamiento: document.getElementById("tratamiento").value
    };
  
    try {
      const respuesta = await fetch("http://localhost:5000/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
  
      const resultado = await respuesta.json();
      alert(resultado.mensaje || "Error al registrar");
    } catch (error) {
      console.error("No se pudo conectar al servidor", error);
    }
  }
