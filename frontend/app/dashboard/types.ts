/* Tipos utilizados en el sistema. */

// Modelo de equipos de cómputo.

export interface Impresora {
  _id?: string;
  departamento: string;
  edificio: string;
  ubicacion: string;
  nombre: string;
  email: string;
  equipo: string;
  usuario: string;
  ip: string;
  codigo: string;
  reservado: boolean;
  
}

// Modelo de administrador.

export interface UsuarioAdmin {
  _id?: string;
  nombre: string;
  usuario: string;
  rol: string;
}

// Modelo del formulario de administradores.

export interface FormAdmin {
  nombre: string;
  usuario: string;
  password: string;
  repetirPassword: string;
  passwordActual: string;
}