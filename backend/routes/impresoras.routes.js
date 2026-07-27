// Rutas de la API para la gestión de impresoras.

const express = require("express");
const router = express.Router();
const Impresora = require("../models/impresora");
const { verificarToken, soloAdmin } = require("../middleware/auth");
const jwt = require("jsonwebtoken");

// Obtiene el listado de impresoras y permite realizar búsquedas
// y aplicar filtros por departamento, edificio, ubicación y equipo.






























// Obtiene el listado de impresoras y permite realizar búsquedas
// y aplicar filtros por departamento, edificio, ubicación, equipo y estado.

router.get("/", async (req, res) => {
  try {
    const {
      busqueda,
      departamento,
      edificio,
      ubicacion,
      equipo,
      reservado,
    } = req.query;

    const condiciones = [];

    // Verifica si el usuario está autenticado.

    const auth = req.headers.authorization;
    let logueado = false;

    if (auth && auth.startsWith("Bearer ")) {
      try {
        jwt.verify(
          auth.split(" ")[1],
          process.env.JWT_SECRET
        );

        logueado = true;
      } catch {
        logueado = false;
      }
    }

    // Sin iniciar sesión, solamente muestra registros disponibles.

    if (!logueado) {
      condiciones.push({
        $or: [
          { reservado: false },
          { reservado: { $exists: false } },
        ],
      });
    }

    // Búsqueda general por texto.

    if (busqueda && busqueda.trim() !== "") {
      const texto = busqueda.trim();

      condiciones.push({
        $or: [
          { departamento: { $regex: texto, $options: "i" } },
          { edificio: { $regex: texto, $options: "i" } },
          { ubicacion: { $regex: texto, $options: "i" } },
          { nombre: { $regex: texto, $options: "i" } },
          { email: { $regex: texto, $options: "i" } },
          { equipo: { $regex: texto, $options: "i" } },
          { usuario: { $regex: texto, $options: "i" } },
          { ip: { $regex: texto, $options: "i" } },
          { codigo: { $regex: texto, $options: "i" } },
        ],
      });
    }

    // Filtros seleccionados.

    if (departamento && departamento.trim() !== "") {
      condiciones.push({
        departamento: departamento.trim(),
      });
    }

    if (edificio && edificio.trim() !== "") {
      condiciones.push({
        edificio: edificio.trim(),
      });
    }

    if (ubicacion && ubicacion.trim() !== "") {
      condiciones.push({
        ubicacion: ubicacion.trim(),
      });
    }

    if (equipo && equipo.trim() !== "") {
      condiciones.push({
        equipo: equipo.trim(),
      });
    }

    // El filtro de reservados solo se permite con sesión iniciada.

    if (logueado && reservado === "true") {
      condiciones.push({
        reservado: true,
      });
    }

    if (logueado && reservado === "false") {
      condiciones.push({
        $or: [
          { reservado: false },
          { reservado: { $exists: false } },
        ],
      });
    }

    // Construye el filtro final.

    const filtro =
      condiciones.length > 0
        ? { $and: condiciones }
        : {};

    console.log("QUERY:", req.query);
    console.log(
      "FILTRO:",
      JSON.stringify(filtro, null, 2)
    );

    const datos = await Impresora.find(filtro).sort({
      departamento: 1,
    });

    console.log(
      "REGISTROS ENCONTRADOS:",
      datos.length
    );

    res.json(datos);
  } catch (error) {
    console.error(
      "ERROR AL OBTENER IMPRESORAS:",
      error
    );

    res.status(500).json({
      mensaje: "Error al obtener impresoras",
    });
  }
});

// Obtiene el número total de registros.

router.get("/count", async (req, res) => {
  try {
    const total = await Impresora.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al contar registros",
    });
  }
});

// Obtiene la lista de edificios registrados.

router.get("/edificios", async (req, res) => {
  try {
    const edificios = await Impresora.distinct("edificio");

    edificios.sort((a, b) => a.localeCompare(b));

    res.json(edificios);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener edificios",
    });
  }
});

// Obtiene los valores únicos para los filtros del sistema.

router.get("/filtros", async (req, res) => {
  try {
    const departamentos = await Impresora.distinct("departamento");
    const edificios = await Impresora.distinct("edificio");
    const ubicaciones = await Impresora.distinct("ubicacion");
    const equipos = await Impresora.distinct("equipo");

    res.json({
      departamentos: departamentos.sort(),
      edificios: edificios.sort(),
      ubicaciones: ubicaciones.sort(),
      equipos: equipos.sort(),
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener filtros",
    });
  }
});

// Registra una nueva impresora.
// Requiere autenticación y permisos de administrador.

router.post("/", verificarToken, soloAdmin, async (req, res) => {
  try {
    const nueva = new Impresora(req.body);

    await nueva.save();

    res.json({
      mensaje: "Impresora guardada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al guardar impresora",
    });
  }
});

// Actualiza la información de una impresora.
// Requiere autenticación y permisos de administrador.

router.put("/:id", verificarToken, soloAdmin, async (req, res) => {
  try {
    await Impresora.findByIdAndUpdate(req.params.id, req.body);

    res.json({
      mensaje: "Impresora actualizada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar impresora",
    });
  }
});

// Elimina una impresora.
// Requiere autenticación y permisos de administrador.

router.delete("/:id", verificarToken, soloAdmin, async (req, res) => {
  try {
    await Impresora.findByIdAndDelete(req.params.id);

    res.json({
      mensaje: "Impresora eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar impresora",
    });
  }
});

// Obtiene las estadísticas generales del dashboard.

router.get("/stats", async (req, res) => {
  try {

    const auth = req.headers.authorization;

    let logueado = false;

    if (auth && auth.startsWith("Bearer ")) {
      try {
        jwt.verify(
          auth.split(" ")[1],
          process.env.JWT_SECRET
        );

        logueado = true;
      } catch {
        logueado = false;
      }
    }

    const filtroEquipos = {};

    const filtroIPs = {
      ip: {
        $exists: true,
        $ne: "",
      },
    };

    const filtroUsuarios = {
      usuario: {
        $exists: true,
        $ne: "",
      },
    };

    if (!logueado) {
      filtroEquipos.$or = [
        { reservado: false },
        { reservado: { $exists: false } },
      ];

      filtroIPs.$or = [
        { reservado: false },
        { reservado: { $exists: false } },
      ];

      filtroUsuarios.$or = [
        { reservado: false },
        { reservado: { $exists: false } },
      ];
    }

    const totalEquipos = await Impresora.countDocuments(filtroEquipos);

    const totalIPs = await Impresora.countDocuments(filtroIPs);

    const totalUsuarios = await Impresora.countDocuments(filtroUsuarios);

    // Contador de IPs reservadas.

    const filtroIPsReservadas = {
      reservado: true,
      ip: {
        $exists: true,
        $ne: "",
      },
    };

    const ipsReservadas = logueado
      ? await Impresora.countDocuments(filtroIPsReservadas)
      : 0;

    res.json({
      totalEquipos,
      totalUsuarios,
      totalIPs,
      ipsReservadas,
      equiposActivos: totalEquipos,
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener estadísticas",
    });
  }
});

// Exporta las rutas de impresoras.

module.exports = router;