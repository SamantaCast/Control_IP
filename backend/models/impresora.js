// Modelo de impresoras para almacenar y gestionar datos en MongoDB.

const mongoose = require("mongoose");

// Define la estructura del documento de una impresora.

const impresoraSchema = new mongoose.Schema(
  {
    // Departamento al que pertenece la impresora.
    departamento: String,

    // Edificio donde se encuentra ubicada.
    edificio: String,

    // Ubicación específica de la impresora.
    ubicacion: String,

    // Nombre del responsable o usuario asignado.
    nombre: String,

    // Correo electrónico del usuario.
    email: String,

    // Nombre o identificador del equipo.
    equipo: String,

    // Usuario del equipo.
    usuario: String,

    // Dirección IP de la impresora.
    ip: String,

    // Código o número de inventario.
    codigo: String,

    reservado: {
      type: Boolean,
      default: false
    },
  },
  
  {
    // Agrega automáticamente las fechas de creación y actualización.
    timestamps: true,
  }

);

// Exporta el modelo utilizando la colección "datos".

module.exports = mongoose.model("Impresora", impresoraSchema, "datos");