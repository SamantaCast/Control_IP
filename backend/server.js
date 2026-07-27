// Configuración del servidor y conexión a MongoDB.

const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Inicializa la aplicación de Express.

const app = express();

app.use(cors());
app.use(express.json());

// Importa los modelos, rutas y middlewares.

const User = require("./models/user");
const impresorasRoutes = require("./routes/impresoras.routes");
const usersRoutes = require("./routes/users.routes");
const { verificarToken, soloAdmin } = require("./middleware/auth");

// Establece la conexión con la base de datos.

conectarDB();

// Ruta de prueba para verificar que el servidor está funcionando.

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// Autentica a los usuarios y genera un token JWT.

app.post("/login", async (req, res) => {
  try {
    const { usuario, password } = req.body;

    // Busca el usuario registrado.
    const user = await User.findOne({ usuario });

    if (!user) {
      return res.status(401).json({
        mensaje: "Datos incorrectos",
      });
    }

    // Verifica que la contraseña sea correcta.
    const coincide = user.password.startsWith("$2")
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!coincide) {
      return res.status(401).json({
        mensaje: "Datos incorrectos",
      });
    }

    // Genera el token de autenticación.
    const token = jwt.sign(
      {
        id: user._id,
        rol: user.rol,
        usuario: user.usuario,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Muestra la información del inicio de sesión.
    console.log("RESPUESTA LOGIN:");
    console.log({
      mensaje: "Login correcto",
      token,
      rol: user.rol,
      nombre: user.nombre,
      usuario: user.usuario,
    });

    return res.json({
      mensaje: "Login correcto",
      token,
      rol: user.rol,
      nombre: user.nombre,
      usuario: user.usuario,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error en el servidor",
    });
  }
});

// Registra las rutas para la gestión de impresoras.

console.log("Cargando rutas de impresoras...");

app.use("/api/impresoras", impresorasRoutes);

// Ruta de prueba para comprobar el funcionamiento de la API.

app.get("/api/prueba", (req, res) => {
  res.json({
    ok: true,
    mensaje: "Servidor correcto",
  });
});

// Registra las rutas para la gestión de administradores.
// Requiere autenticación y permisos de administrador.

app.use("/api/users", verificarToken, soloAdmin, usersRoutes);

// Inicia el servidor en el puerto configurado.

const PORT = process.env.PORT || 5050;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});