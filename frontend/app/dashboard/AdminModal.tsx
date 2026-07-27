/* Modal para crear y editar administradores. */

"use client";

// Importaciones.

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import type { FormAdmin } from "./types";

// Propiedades del componente.

interface Props {
  rol: string;
  mostrar: boolean;
  editandoAdminId: string | null;
  formAdmin: FormAdmin;
  mostrarPasswordAdmin: boolean;
  setMostrarPasswordAdmin: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  mostrarRepetirPasswordAdmin: boolean;
  setMostrarRepetirPasswordAdmin: React.Dispatch<
  React.SetStateAction<boolean>
  >;
  
  cumpleLongitud: boolean;
  cumpleMayuscula: boolean;
  cumpleMinuscula: boolean;
  cumpleSimbolo: boolean;
  cumpleRepeticion: boolean;

  adminInputRefs: React.MutableRefObject<
    (HTMLInputElement | null)[]
  >;

  guardarAdmin: () => void;
  cerrarFormularioAdmin: () => void;
  cancelarFormularioAdmin: () => void;

  handleAdminChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  moverAdminConEnter: (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => void;
}

// Componente principal.

export default function AdminModal({
  rol,
  mostrar,
  editandoAdminId,
  formAdmin,
  mostrarPasswordAdmin,
  setMostrarPasswordAdmin,
  mostrarRepetirPasswordAdmin,
  setMostrarRepetirPasswordAdmin,
  cumpleLongitud,
  cumpleMayuscula,
  cumpleMinuscula,
  cumpleSimbolo,
  cumpleRepeticion,
  adminInputRefs,
  guardarAdmin,
  cerrarFormularioAdmin,
  cancelarFormularioAdmin,
  handleAdminChange,
  moverAdminConEnter,
}: Props) {

  // Verifica que el usuario sea administrador y que el modal esté visible.

  if (rol !== "admin" || !mostrar) {
    return null;
  }

  return (
    <div className="overlayStyle">

      {/* Formulario del administrador. */}

      <form
        className="adminModalStyle"
        onSubmit={(e) => {
          e.preventDefault();
          guardarAdmin();
        }}
      >

        {/* Encabezado del modal. */}

        <div className="modalHeader">
          <div className="modalHeaderIcon">
            <FontAwesomeIcon icon={faUsers} />
          </div>

          <div>
            <h2 className="modalTitle">
              {editandoAdminId
                ? "Editar Administrador"
                : "Nuevo Administrador"}
            </h2>

            <p className="modalDescription">
              Capture la información del administrador.
            </p>
          </div>
        </div>

        <div className="modalDivider"></div>

        {/* Botón para cerrar el modal. */}

        <button
          type="button"
          className="adminCloseBtn"
          onClick={cerrarFormularioAdmin}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* Cuerpo del formulario. */}

        <div className="formSection">

          {/* Campo para el nombre completo. */}

          <div className="inputWrapper">
            <div className="inputIcon">
              <FontAwesomeIcon icon={faUser} />
            </div>

            <input
              ref={(el) => {
                adminInputRefs.current[0] = el;
              }}
              name="nombre"
              placeholder="Nombre completo"
              value={formAdmin.nombre}
              onChange={handleAdminChange}
              onKeyDown={(e) => moverAdminConEnter(e, 0)}
              className="formInput"
              required
            />
          </div>

          {/* Campo para el nombre de usuario. */}

          <div className="inputWrapper">
            <div className="inputIcon">
              <FontAwesomeIcon icon={faUser} />
            </div>

            <input
              ref={(el) => {
                adminInputRefs.current[1] = el;
              }}
              name="usuario"
              placeholder="Usuario"
              value={formAdmin.usuario}
              onChange={handleAdminChange}
              onKeyDown={(e) => moverAdminConEnter(e, 1)}
              className="formInput"
              autoComplete="username"
              required
            />
          </div>

      {/* Campo para la contraseña. */}

      <div className="inputWrapper">
        <div className="inputIcon">
          <FontAwesomeIcon icon={faLock} />
        </div>

        <input
          ref={(el) => {
            adminInputRefs.current[2] = el;
          }}
          name="password"
          type={
            mostrarPasswordAdmin
              ? "text"
              : "password"
          }
          placeholder="Contraseña"
          value={formAdmin.password}
          onChange={handleAdminChange}
          onKeyDown={(e) =>
            moverAdminConEnter(e, 2)
          }
          className="formInput"
          autoComplete="new-password"
          required
        />

        <button
          type="button"
          className="passwordEyeBtn"
          onClick={() =>
            setMostrarPasswordAdmin(
              (valorAnterior) => !valorAnterior
            )
          }
          aria-label={
            mostrarPasswordAdmin
              ? "Ocultar contraseña"
              : "Mostrar contraseña"
          }
          title={
            mostrarPasswordAdmin
              ? "Ocultar contraseña"
              : "Mostrar contraseña"
          }
        >
          <FontAwesomeIcon
            icon={
              mostrarPasswordAdmin
                ? faEyeSlash
                : faEye
            }
          />
        </button>
      </div>

      {/* Reglas para validar la contraseña. */}

      <div className="adminPasswordRules">
        <div className={cumpleLongitud ? "ok" : ""}>
          {cumpleLongitud ? "✓" : "✗"} Mínimo 8 caracteres
        </div>

        <div className={cumpleMayuscula ? "ok" : ""}>
          {cumpleMayuscula ? "✓" : "✗"} Al menos una mayúscula
        </div>

        <div className={cumpleMinuscula ? "ok" : ""}>
          {cumpleMinuscula ? "✓" : "✗"} Al menos una minúscula
        </div>

        <div className={cumpleSimbolo ? "ok" : ""}>
          {cumpleSimbolo ? "✓" : "✗"} Al menos un símbolo
        </div>

        <div className={cumpleRepeticion ? "ok" : ""}>
          {cumpleRepeticion ? "✓" : "✗"} Las contraseñas coinciden
        </div>
      </div>

      {/* Campo para confirmar la contraseña. */}

      <div className="inputWrapper">
        <div className="inputIcon">
          <FontAwesomeIcon icon={faLock} />
        </div>

        <input
          ref={(el) => {
            adminInputRefs.current[3] = el;
          }}
          name="repetirPassword"
          type={
            mostrarRepetirPasswordAdmin
              ? "text"
              : "password"
          }
          placeholder="Repetir contraseña"
          value={formAdmin.repetirPassword}
          onChange={handleAdminChange}
          onKeyDown={(e) =>
            moverAdminConEnter(e, 3)
          }
          className="formInput"
          autoComplete="new-password"
          required
        />

        <button
          type="button"
          className="passwordEyeBtn"
          onClick={() =>
            setMostrarRepetirPasswordAdmin(
              (valorAnterior) => !valorAnterior
            )
          }
          aria-label={
            mostrarRepetirPasswordAdmin
              ? "Ocultar confirmación de contraseña"
              : "Mostrar confirmación de contraseña"
          }
          title={
            mostrarRepetirPasswordAdmin
              ? "Ocultar contraseña"
              : "Mostrar contraseña"
          }
        >
          <FontAwesomeIcon
            icon={
              mostrarRepetirPasswordAdmin
                ? faEyeSlash
                : faEye
            }
          />
        </button>
      </div>
    </div>

        {/* Pie del modal. */}

        <div className="modalFooter">

          {/* Botón para cancelar la operación. */}

          <button
            type="button"
            className="cancelBtn"
            onClick={cancelarFormularioAdmin}
          >
            Cancelar
          </button>

          {/* Botón para guardar o actualizar el administrador. */}

          <button
            type="submit"
            className="saveBtn"
          >
            {editandoAdminId
              ? "Actualizar"
              : "Guardar"}
          </button>

        </div>

      </form>
    </div>
  );
}