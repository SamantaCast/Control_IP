/* Componente principal de la aplicación. */

"use client";

// Importaciones.

import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import EquipmentTable from "./EquipmentTable";
import Pagination from "./Pagination";
import EquipmentModal from "./EquipmentModal";
import AdminModal from "./AdminModal";
import AdminListModal from "./AdminListModal";
import "../../styles/dashboard.css";
import "../../styles/forms.css";
import "../../styles/modal.css";
import "../../styles/table.css";
import "../../styles/pagination.css";
import "../../styles/user-menu.css";
import "../../styles/searchbar.css";
import "../../styles/responsive.css";
import type {
  Impresora,
  UsuarioAdmin,
  FormAdmin,
} from "./types";
import { exportarExcel } from "../utils/exportExcel";
import { exportarPDF } from "../utils/exportPDF";

// Constantes.

const vacioImpresora: Impresora = {
  departamento: "",
  edificio: "",
  ubicacion: "",
  nombre: "",
  email: "",
  equipo: "",
  usuario: "",
  ip: "",
  codigo: "",
  reservado: false,
};

// Componente principal.

export default function Page() {

  // Estados del inicio de sesión.

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [logueado, setLogueado] = useState(false);
  const [rol, setRol] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);

  // Contadores de registros.

  const [totalRegistros, setTotalRegistros] = useState(0);
  const [coincidencias, setCoincidencias] = useState(0);

  // Estados del buscador.

  const [busqueda, setBusqueda] = useState("");
  const [filtroEdificio, setFiltroEdificio] = useState("");
  const [filtroDepartamento, setFiltroDepartamento] = useState("");
  const [filtroUbicacion, setFiltroUbicacion] = useState("");
  const [filtroEquipo, setFiltroEquipo] = useState("");
  const [filtroReservado, setFiltroReservado] = useState("");

  // Estados de los filtros.

  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [ubicaciones, setUbicaciones] = useState<string[]>([]);
  const [equipos, setEquipos] = useState<string[]>([]);
  const [edificios, setEdificios] = useState<string[]>([]);

  // Lista de equipos de cómputo.

  const [impresoras, setImpresoras] = useState<Impresora[]>([]);

  // Formulario de equipos de cómputo.

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] =
    useState<Impresora>(vacioImpresora);

  // Estados de los administradores.

  const [administradores, setAdministradores] =
    useState<UsuarioAdmin[]>([]);
  const [administradoresRegistrados, setAdministradoresRegistrados] =
    useState<UsuarioAdmin[]>([]);
  const [mostrarAdmins, setMostrarAdmins] =
    useState(false);

  const [
    mostrarAdministradoresRegistrados,
    setMostrarAdministradoresRegistrados,
  ] = useState(false);

  const [editandoAdminId, setEditandoAdminId] =
    useState<string | null>(null);

  const [
    mostrarPasswordAdmin,
    setMostrarPasswordAdmin,
  ] = useState(false);

  const [
    mostrarRepetirPasswordAdmin,
    setMostrarRepetirPasswordAdmin,
  ] = useState(false);

  // Referencias para el control de foco entre los campos.

  const adminInputRefs =
    useRef<(HTMLInputElement | null)[]>([]);

  // Formulario de administradores.

  const [formAdmin, setFormAdmin] = useState({
    nombre: "",
    usuario: "",
    password: "",
    repetirPassword: "",
    passwordActual: "",
  });

  // Navegación entre los campos del formulario.

  const moverAdminConEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const siguiente =
      adminInputRefs.current[index + 1];

    if (siguiente) {
      siguiente.focus();
    } else {
      guardarAdmin();
    }
  };

  // Estadísticas del dashboard.

  const [stats, setStats] = useState({
    totalEquipos: 0,
    equiposActivos: 0,
    totalUsuarios: 0,
    totalIPs: 0,
    ipsReservadas: 0,
  });

  // Configuración del ordenamiento.

  const [ordenCampo, setOrdenCampo] = useState("");
  const [ordenDireccion, setOrdenDireccion] =
    useState<"asc" | "desc">("asc");

  function ordenarPor(campo: string) {
    if (ordenCampo === campo) {
      setOrdenDireccion(
        ordenDireccion === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setOrdenCampo(campo);
      setOrdenDireccion("asc");
    }
  }

  // Exportación de registros.

  const descargarExcel = async () => {
    let incluirReservados = false;

    // Solamente el administrador puede decidir incluirlos.

    if (rol === "admin") {
      const respuesta = await Swal.fire({
        icon: "question",
        title: "Exportar a Excel",
        text: "¿Deseas incluir los registros marcados como reservados?",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Sí, incluir",
        denyButtonText: "No incluir",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#8A2036",
        denyButtonColor: "#6c757d",
        cancelButtonColor: "#999999",
      });

      // Si pulsa Cancelar, no genera el archivo.

      if (respuesta.isDismissed) {
        return;
      }

      incluirReservados = respuesta.isConfirmed;
    }

    await exportarExcel(impresorasOrdenadas, {
      esAdmin: rol === "admin",
      incluirReservados,
    });
  };

  const generarPDF = async () => {
    let incluirReservados = false;

    // Solamente el administrador puede decidir incluirlos.

    if (rol === "admin") {
      const respuesta = await Swal.fire({
        icon: "question",
        title: "Exportar a PDF",
        text: "¿Deseas incluir los registros marcados como reservados?",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Sí, incluir",
        denyButtonText: "No incluir",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#8A2036",
        denyButtonColor: "#6c757d",
        cancelButtonColor: "#999999",
      });

      // Si pulsa Cancelar, no genera el archivo.

      if (respuesta.isDismissed) {
        return;
      }

      incluirReservados = respuesta.isConfirmed;
    }

    await exportarPDF(impresorasOrdenadas, {
      esAdmin: rol === "admin",
      incluirReservados,
    });
  };

  // Ordena los registros según la columna seleccionada.

  const impresorasOrdenadas = [...impresoras].sort((a, b) => {
    if (!ordenCampo) return 0;

    const valorA = String(
      a[ordenCampo as keyof Impresora] ?? ""
    ).toLowerCase();

    const valorB = String(
      b[ordenCampo as keyof Impresora] ?? ""
    ).toLowerCase();

    if (valorA < valorB)
      return ordenDireccion === "asc" ? -1 : 1;

    if (valorA > valorB)
      return ordenDireccion === "asc" ? 1 : -1;

    return 0;
  });

  // Configuración de la paginación.

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] =
    useState(15);

  // Calcula los registros que se mostrarán por página.

  const totalPaginas = Math.ceil(
    impresoras.length / registrosPorPagina
  );

  const indiceInicio =
    (paginaActual - 1) * registrosPorPagina;

  const indiceFin =
    indiceInicio + registrosPorPagina;

  const impresorasPaginadas =
    impresorasOrdenadas.slice(
      indiceInicio,
      indiceFin
    );

  // Carga la información inicial del sistema y recupera la sesión del usuario.

  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    const rolGuardado = localStorage.getItem("rol");
    const nombreGuardado = localStorage.getItem("nombre");
    const loginTime = localStorage.getItem("loginTime");

    const OCHO_HORAS = 8 * 60 * 60 * 1000;

    const sesionValida =
      tokenGuardado &&
      loginTime &&
      Date.now() - Number(loginTime) < OCHO_HORAS;

    if (sesionValida) {
      cargarImpresoras(tokenGuardado, "");

      setToken(tokenGuardado);
      setRol(rolGuardado || "");
      setNombreUsuario(nombreGuardado || "");
      setLogueado(true);

      if (rolGuardado === "admin") {
        cargarAdministradores(tokenGuardado);
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      localStorage.removeItem("nombre");
      localStorage.removeItem("loginTime");

      cargarImpresoras("", "");
    }

    cargarFiltros();
    cargarEdificios();

    if (sesionValida) {
      cargarStats(tokenGuardado);
    } else {
      cargarStats();
    }

  }, []);

  // Ejecuta la búsqueda automáticamente cuando cambian los filtros.

  useEffect(() => {
    const tiempo = setTimeout(() => {
      if (
        !busqueda.trim() &&
        !filtroDepartamento &&
        !filtroEdificio &&
        !filtroUbicacion &&
        !filtroEquipo &&
        !filtroReservado
      ) {
        cargarImpresoras(token, "");
        cargarStats(token);
      } else {
        buscar();
      }
    }, 300);

    return () => clearTimeout(tiempo);
  }, [
    busqueda,
    filtroDepartamento,
    filtroEdificio,
    filtroUbicacion,
    filtroEquipo,
    filtroReservado,
    token,
  ]);

  // Genera la cabecera de autorización para las peticiones protegidas.

  const authHeader = (tok: string) => ({
    headers: {
      Authorization: `Bearer ${tok}`,
    },
  });

  // Gestiona los errores relacionados con la sesión del usuario.

  const manejarErrorSesion = async (error: any) => {
    const status = error?.response?.status;

    // Verifica si la sesión expiró.

    if (status === 401) {

      await cerrarSesion();

      await Swal.fire({
        icon: "warning",
        title: "Sesión expirada",
        text: "Tu sesión ha expirado. Inicia sesión nuevamente.",
        confirmButtonColor: "#8A2036",
      });

      return true;
    }

    // Verifica si el usuario no tiene permisos.

    if (status === 403) {

      await Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tienes permisos para realizar esta acción.",
        confirmButtonColor: "#8A2036",
      });

      return true;
    }

    return false;
  };

  // Obtiene la lista de edificios registrados.

  const cargarEdificios = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras/edificios`
      );

      const lista = res.data
        .filter((e: string) => e && e.trim() !== "")
        .sort((a: string, b: string) =>
          a.localeCompare(b)
        );

      setEdificios(lista);

    } catch (error) {
      console.log(error);
    }
  };

  // Obtiene las estadísticas del dashboard.

  const cargarStats = async (tok: string = "") => {
    try {

      const config = tok ? authHeader(tok) : {};

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras/stats`,
        config
      );

      setStats(res.data);

    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };


  // Actualiza la tabla y las estadísticas del dashboard.

    const actualizarDashboard = async (
      tok: string,
      textoBusqueda: string = ""
    ) => {
      await Promise.all([
        cargarImpresoras(tok, textoBusqueda),
        cargarStats(tok),
      ]);
    };

// Obtiene los datos para los filtros de búsqueda.

async function cargarFiltros() {
  try {
    const respuesta = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras/filtros`
    );

    const datos = await respuesta.json();

    console.log(datos.departamentos);

    // Actualiza las listas utilizadas por los filtros.

    setDepartamentos(datos.departamentos);
    setEdificios(datos.edificios);
    setUbicaciones(datos.ubicaciones);
    setEquipos(datos.equipos);

  } catch (error) {
    console.error("Error cargando filtros", error);
  }
}

// Inicia la sesión del usuario.

const login = async () => {

  // Verifica que se hayan capturado las credenciales.

  if (!usuario.trim()) return;
  if (!password.trim()) return;

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/login`,
      {
        usuario: usuario.trim(),
        password: password.trim(),
      }
    );

    // Muestra la respuesta del inicio de sesión.

    console.log("LOGIN:", res.data);

    // Guarda la información de la sesión en el navegador.

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("rol", res.data.rol);
    localStorage.setItem("nombre", res.data.nombre);
    localStorage.setItem("loginTime", Date.now().toString());

    // Actualiza los estados de la aplicación.

    setToken(res.data.token);
    setRol(res.data.rol);
    setNombreUsuario(res.data.nombre);
    setLogueado(true);
    setMostrarLogin(false);

    // Carga la información principal del sistema.

    cargarFiltros();
    cargarEdificios();
    cargarStats(res.data.token);

    // Obtiene la lista de administradores si el usuario tiene ese rol.

    if (res.data.rol === "admin") {
      cargarAdministradores(res.data.token);
    }

  } catch (error: any) {
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Usuario y/o contraseña incorrectos.",
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar",
    });
  }
};

// Obtiene los registros de equipos de cómputo.

const cargarImpresoras = async (
  tok: string,
  textoBusqueda: string
) => {
  try {
    const config = tok ? authHeader(tok) : {};

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras?busqueda=${encodeURIComponent(
        textoBusqueda
      )}`,
      config
    );

    // Actualiza la información de la tabla.

    setImpresoras(res.data);
    setCoincidencias(res.data.length);

    if (textoBusqueda === "") {
      setTotalRegistros(res.data.length);
    }

  } catch (error) {
    console.log("Error al cargar impresoras:", error);
  }
};

// Realiza la búsqueda de registros.

const buscar = async () => {
  try {
    const config = token ? authHeader(token) : {};

   const params = new URLSearchParams({
    busqueda: busqueda.trim(),
    departamento: filtroDepartamento,
    edificio: filtroEdificio,
    ubicacion: filtroUbicacion,
    equipo: filtroEquipo,
    reservado: filtroReservado,
  });

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras?${params.toString()}`,
      config
    );

    // Actualiza los resultados de la búsqueda.

    setImpresoras(res.data);
    setPaginaActual(1);
    setCoincidencias(res.data.length);

  } catch (error) {
    console.log(error);
  }
};

// Abre el formulario para registrar un nuevo equipo.

const abrirNuevo = () => {
  setEditandoId(null);
  setForm(vacioImpresora);
  setMostrarFormulario(true);
};

// Abre el formulario para editar un registro existente.

const abrirEditar = (imp: Impresora) => {
  setEditandoId(imp._id || null);

  // Carga la información del registro seleccionado.

  setForm({
  _id: imp._id,
  departamento: imp.departamento || "",
  edificio: imp.edificio || "",
  ubicacion: imp.ubicacion || "",
  nombre: imp.nombre || "",
  email: imp.email || "",
  equipo: imp.equipo || "",
  usuario: imp.usuario || "",
  ip: imp.ip || "",
  codigo: imp.codigo || "",
  reservado: imp.reservado ?? false,
});

  setMostrarFormulario(true);
};

// Actualiza los campos del formulario.

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};

// Guarda o actualiza un registro.

const guardar = async () => {

  // Verifica que los campos obligatorios estén completos.

const todosVacios =
  !form.departamento.trim() &&
  !form.edificio.trim() &&
  !form.ubicacion.trim() &&
  !form.nombre.trim() &&
  !form.email.trim() &&
  !form.equipo.trim() &&
  !form.usuario.trim() &&
  !form.ip.trim() &&
  !form.codigo.trim();

if (todosVacios) {
  await Swal.fire({
    icon: "warning",
    title: "Datos incompletos",
    text: "Debe capturar al menos un dato para guardar el registro.",
    confirmButtonColor: "#8A2036",
    confirmButtonText: "Aceptar",
  });

  return;
}

  try {

    // Actualiza el registro si ya existe.

    if (editandoId) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras/${editandoId}`,
        form,
        authHeader(token)
      );

      await Swal.fire({
        icon: "success",
        title: "Registro actualizado",
        text: "Los cambios fueron guardados correctamente.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar",
      });

    } else {

      // Crea un nuevo registro.

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras`,
        form,
        authHeader(token)
      );

      await Swal.fire({
        icon: "success",
        title: "Registro agregado",
        text: "El registro fue agregado correctamente.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar",
      });
    }

    // Restablece el formulario.

    setMostrarFormulario(false);
    setEditandoId(null);
    setForm(vacioImpresora);

    // Actualiza la información del sistema.

    await actualizarDashboard(token, busqueda);

  } catch (error: any) {

    if (await manejarErrorSesion(error)) return;

    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo guardar el registro.",
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar",
    });
  }
};

// Elimina un registro.

const eliminar = async (id?: string) => {
  if (!id) return;

  // Solicita confirmación antes de eliminar.

  const confirmar = await Swal.fire({
    title: "¿Eliminar registro?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#8A2036",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!confirmar.isConfirmed) return;

  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras/${id}`,
      authHeader(token)
    );

    await Swal.fire({
      icon: "success",
      title: "Registro eliminado",
      text: "El registro fue eliminado correctamente.",
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar",
    });

    // Actualiza la información del sistema.

   await actualizarDashboard(token, busqueda);

  } catch (error: any) {

    if (await manejarErrorSesion(error)) return;

    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo eliminar el registro.",
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar",
    });
  }
};


// Obtiene la lista de administradores.

const cargarAdministradores = async (tok: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
      authHeader(tok)
    );

    // Actualiza la lista de administradores.

    setAdministradores(res.data);

  } catch (error) {
    console.log(error);
  }
};

// Obtiene los administradores registrados y muestra el modal.

const cargarAdministradoresRegistrados = async (tok: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
      authHeader(tok)
    );

    // Actualiza la información y muestra el listado.

    setAdministradoresRegistrados(res.data);
    setMostrarAdministradoresRegistrados(true);

  } catch (error) {
    console.log(error);

    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error al cargar administradores.",
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar",
    });
  }
};

// Abre el formulario para registrar un nuevo administrador.

const abrirNuevoAdmin = () => {
  setMostrarPasswordAdmin(false);
  setMostrarRepetirPasswordAdmin(false);
  setMostrarAdministradoresRegistrados(false);
  setEditandoAdminId(null);

  setFormAdmin({
    nombre: "",
    usuario: "",
    password: "",
    repetirPassword: "",
    passwordActual: "",
  });

  setMostrarAdmins(true);
};

// Abre el formulario para editar un administrador.

const abrirEditarAdmin = (
  admin: UsuarioAdmin
) => {
  setMostrarPasswordAdmin(false);
  setMostrarRepetirPasswordAdmin(false);
  setMostrarAdministradoresRegistrados(false);
  setEditandoAdminId(admin._id || null);

  setFormAdmin({
    nombre: admin.nombre,
    usuario: admin.usuario,
    password: "",
    repetirPassword: "",
    passwordActual: "",
  });

  setMostrarAdmins(true);
};

// Actualiza los campos del formulario de administradores.

const handleAdminChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setFormAdmin({
    ...formAdmin,
    [e.target.name]: e.target.value,
  });
};

// Valida que la contraseña cumpla con los requisitos de seguridad.

const passwordValida = (pass: string) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

  return regex.test(pass);
};

// Indicadores visuales para validar la contraseña.

const passwordActualTexto = formAdmin.password;

const cumpleLongitud =
  passwordActualTexto.length >= 8;

const cumpleMayuscula =
  /[A-Z]/.test(passwordActualTexto);

const cumpleMinuscula =
  /[a-z]/.test(passwordActualTexto);

const cumpleSimbolo =
  /[^A-Za-z0-9]/.test(passwordActualTexto);

const cumpleRepeticion =
  formAdmin.repetirPassword.length > 0 &&
  formAdmin.password === formAdmin.repetirPassword;

// Guarda o actualiza un administrador.

const guardarAdmin = async () => {
  try {

    // Verifica que ambas contraseñas coincidan.

    if (
      formAdmin.password !==
      formAdmin.repetirPassword
    ) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar",
      });

      return;
    }

    // Valida los requisitos de seguridad de la contraseña.

    if (!passwordValida(formAdmin.password)) {
      await Swal.fire({
        icon: "error",
        title: "Contraseña inválida",
        text: "Debe contener mayúscula, minúscula, símbolo y mínimo 8 caracteres.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar",
      });

      return;
    }

    // Actualiza el administrador si ya existe.

    if (editandoAdminId) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${editandoAdminId}`,
        formAdmin,
        authHeader(token)
      );

      await Swal.fire({
        icon: "success",
        title: "Administrador actualizado",
        text: "Los cambios fueron guardados correctamente.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar",
      });

    } else {
      // Crea un nuevo administrador.

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        formAdmin,
        authHeader(token)
      );

      await Swal.fire({
        icon: "success",
        title: "Administrador creado",
        text: "El administrador fue registrado correctamente.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar",
      });
    }

    // Restablece el formulario.

    setEditandoAdminId(null);

    setFormAdmin({
      nombre: "",
      usuario: "",
      password: "",
      repetirPassword: "",
      passwordActual: "",
    });

    // Actualiza las listas de administradores.

    await cargarAdministradores(token);
    await cargarAdministradoresRegistrados(token);

    // Muestra nuevamente el listado de administradores.

    setMostrarAdmins(false);
    setMostrarAdministradoresRegistrados(true);

  } catch (error: any) {

    if (await manejarErrorSesion(error)) return;

    await Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error?.response?.data?.mensaje ||
        "No se pudo guardar el administrador.",
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar",
    });
  }
};

// Elimina un administrador.

const eliminarAdmin = async (id?: string) => {
  if (!id) return;

  // Solicita confirmación antes de eliminar.

  const confirmar = await Swal.fire({
    title: "¿Eliminar administrador?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#8A2036",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!confirmar.isConfirmed) return;

  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
      authHeader(token)
    );

    // Actualiza las listas de administradores.

    setAdministradores((prev) =>
      prev.filter((admin) => admin._id !== id)
    );

    setAdministradoresRegistrados((prev) =>
      prev.filter((admin) => admin._id !== id)
    );

    await Swal.fire({
      icon: "success",
      title: "Administrador eliminado",
      text: "El administrador fue eliminado correctamente.",
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar",
    });

    // Recarga la información desde el servidor.

    await cargarAdministradores(token);
    await cargarAdministradoresRegistrados(token);

  } catch (error: any) {

    if (await manejarErrorSesion(error)) return;

    await Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error?.response?.data?.mensaje ||
        "No se pudo eliminar el administrador.",
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar",
    });
  }
};

// Cierra el formulario de administradores.

const cerrarFormularioAdmin = () => {
  setMostrarAdmins(false);
  setEditandoAdminId(null);
  setMostrarAdministradoresRegistrados(false);
  setMostrarPasswordAdmin(false);
  setMostrarRepetirPasswordAdmin(false);
};

// Cancela la edición y regresa al listado de administradores.

const cancelarFormularioAdmin = () => {
  setMostrarAdmins(false);
  setEditandoAdminId(null);
  setMostrarAdministradoresRegistrados(true);
  setMostrarPasswordAdmin(false);
  setMostrarRepetirPasswordAdmin(false);
};

// Cierra la sesión del usuario.

const cerrarSesion = async () => {

  // Elimina la información almacenada en el navegador.

  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("nombre");
  localStorage.removeItem("loginTime");

  // Restablece la información del usuario.

  setUsuario("");
  setPassword("");
  setToken("");
  setRol("");
  setNombreUsuario("");
  setLogueado(false);

  // Restablece los filtros de búsqueda.

  setBusqueda("");
  setFiltroDepartamento("");
  setFiltroEdificio("");
  setFiltroUbicacion("");
  setFiltroEquipo("");
  setFiltroReservado("");

  // Limpia la información cargada.

  setImpresoras([]);
  setCoincidencias(0);
  setTotalRegistros(0);
  setAdministradores([]);
  setAdministradoresRegistrados([]);

  // Cierra los formularios y ventanas.

  setMostrarFormulario(false);
  setMostrarAdmins(false);
  setMostrarAdministradoresRegistrados(false);
  setMostrarPasswordAdmin(false);
  setMostrarRepetirPasswordAdmin(false);
  setMostrarLogin(false);
  setMostrarMenuUsuario(false);

  // Restablece los formularios.

  setEditandoId(null);
  setEditandoAdminId(null);
  setForm(vacioImpresora);

  setFormAdmin({
    nombre: "",
    usuario: "",
    password: "",
    repetirPassword: "",
    passwordActual: "",
  });

  // Carga nuevamente la información pública.

  await actualizarDashboard("", "");
};

// Abre el listado de administradores registrados.

const abrirAdministradoresRegistrados = () => {
  cargarAdministradoresRegistrados(token);
};

// Interfaz principal.

return (
  <>

    {/* Encabezado del sistema. */}

    <Header
      logueado={logueado}
      usuario={usuario}
      password={password}
      nombreUsuario={nombreUsuario}
      rol={rol}
      mostrarMenuUsuario={mostrarMenuUsuario}
      setMostrarMenuUsuario={setMostrarMenuUsuario}
      mostrarLogin={mostrarLogin}
      setMostrarLogin={setMostrarLogin}
      setUsuario={setUsuario}
      setPassword={setPassword}
      login={login}
      abrirAdministradoresRegistrados={
        abrirAdministradoresRegistrados
      }
      cerrarSesion={cerrarSesion}
    />

    {/* Contenido principal. */}

    <div className="panel">

      {/* Barra de búsqueda y filtros. */}

      <SearchBar
        logueado={logueado}
        impresoras={impresoras}
        token={token}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEdificio={filtroEdificio}
        setFiltroEdificio={setFiltroEdificio}
        edificios={edificios}
        abrirNuevo={abrirNuevo}
        stats={stats}
        departamentos={departamentos}
        ubicaciones={ubicaciones}
        equipos={equipos}
        filtroDepartamento={filtroDepartamento}
        setFiltroDepartamento={setFiltroDepartamento}
        filtroUbicacion={filtroUbicacion}
        setFiltroUbicacion={setFiltroUbicacion}
        filtroEquipo={filtroEquipo}
        filtroReservado={filtroReservado}
        setFiltroReservado={setFiltroReservado}
        setFiltroEquipo={setFiltroEquipo}
        exportarExcel={descargarExcel}
        exportarPDF={generarPDF}
      />
      {/* Tabla de registros. */}

      <EquipmentTable
        impresoras={impresoras}
        impresorasPaginadas={impresorasPaginadas}
        logueado={logueado}
        abrirEditar={abrirEditar}
        eliminar={eliminar}
        ordenarPor={ordenarPor}
        ordenCampo={ordenCampo}
        ordenDireccion={ordenDireccion}
      />

      {/* Controles de paginación. */}

      <Pagination
        impresoras={impresoras}
        indiceInicio={indiceInicio}
        indiceFin={indiceFin}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        setPaginaActual={setPaginaActual}
        registrosPorPagina={registrosPorPagina}
        setRegistrosPorPagina={setRegistrosPorPagina}
      />

    </div>

    {/* Modales de la aplicación. */}

    {/* Modal para agregar o editar registros. */}

    <EquipmentModal
      mostrarFormulario={mostrarFormulario}
      editandoId={editandoId}
      form={form}
      setForm={setForm}
      handleChange={handleChange}
      guardar={guardar}
      setMostrarFormulario={setMostrarFormulario}
      setEditandoId={setEditandoId}
    />

    {/* Modal para crear o editar administradores. */}

    <AdminModal
      rol={rol}
      mostrar={mostrarAdmins}
      editandoAdminId={editandoAdminId}
      formAdmin={formAdmin}
      mostrarPasswordAdmin={
        mostrarPasswordAdmin
      }
      setMostrarPasswordAdmin={
        setMostrarPasswordAdmin
      }
      mostrarRepetirPasswordAdmin={
        mostrarRepetirPasswordAdmin
      }
      setMostrarRepetirPasswordAdmin={
        setMostrarRepetirPasswordAdmin
      }
      cumpleLongitud={cumpleLongitud}
      cumpleMayuscula={cumpleMayuscula}
      cumpleMinuscula={cumpleMinuscula}
      cumpleSimbolo={cumpleSimbolo}
      cumpleRepeticion={cumpleRepeticion}
      adminInputRefs={adminInputRefs}
      guardarAdmin={guardarAdmin}
      cerrarFormularioAdmin={
        cerrarFormularioAdmin
      }
      handleAdminChange={handleAdminChange}
      moverAdminConEnter={moverAdminConEnter}
      cancelarFormularioAdmin={
        cancelarFormularioAdmin
      }
    />

    {/* Modal con la lista de administradores. */}

    <AdminListModal
      rol={rol}
      mostrar={mostrarAdministradoresRegistrados}
      administradoresRegistrados={administradoresRegistrados}
      setMostrar={setMostrarAdministradoresRegistrados}
      abrirEditarAdmin={abrirEditarAdmin}
      eliminarAdmin={eliminarAdmin}
      abrirNuevoAdmin={abrirNuevoAdmin}
    />

  </>
);
}