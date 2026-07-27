/* Modal para visualizar y administrar los usuarios registrados en el sistema. */

"use client";

// Importaciones.

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faXmark,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import type { UsuarioAdmin } from "./types";

// Propiedades del componente.

interface Props {
  rol: string;
  mostrar: boolean;
  administradoresRegistrados: UsuarioAdmin[];
  setMostrar: (value: boolean) => void;
  abrirEditarAdmin: (
    admin: UsuarioAdmin
  ) => void;
  eliminarAdmin: (
    id?: string
  ) => void;
  abrirNuevoAdmin: () => void;
}

// Componente principal.

export default function AdminListModal({
  rol,
  mostrar,
  administradoresRegistrados,
  setMostrar,
  abrirEditarAdmin,
  eliminarAdmin,
  abrirNuevoAdmin,

}: Props) {

  // Verifica que el usuario sea administrador y que el modal esté visible.

  if (rol !== "admin" || !mostrar) {
    return null;
  }

  return (

    // Overlay del modal.

    <div className="overlayStyle">
      <div className="adminListModal">

        {/* Encabezado del modal. */}

        <div className="modalHeader">
          <div>
            <h2 className="modalTitle">
              Administradores
            </h2>

            <p className="modalDescription">
              Administradores registrados.
            </p>

          </div>

          {/* Botón para cerrar el modal. */}

          <button
            className="adminCloseBtn"
            onClick={() => setMostrar(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

        </div>

        <div className="modalDivider"></div>

        {/* Contenido del modal. */}

        <div className="adminListBody">

        {/* Total de administradores registrados. */}

        <p className="adminListTotal">
          Total: {administradoresRegistrados.length}
        </p>

        {/* Tabla de administradores. */}

        <div className="adminTableBox">
          <table className="adminDataTable">
            <thead>
              <tr>
                <th className="adminHeadCell">
                  Usuario
                </th>

                <th className="adminHeadCell">
                  Rol
                </th>

                <th className="adminHeadCell">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {administradoresRegistrados.map((admin) => (
                <tr key={admin._id}>

                  {/* Usuario del administrador. */}

                  <td className="adminCell">
                    {admin.usuario}
                  </td>

                  {/* Rol del administrador. */}

                  <td className="adminCell">
                    {admin.rol}
                  </td>

                  {/* Acciones disponibles. */}

                  <td className="adminCell">
                    <div className="adminActionBtns">

                      {/* Botón para editar el administrador. */}

                      <button
                        className="iconBtn editBtn"
                        onClick={() => abrirEditarAdmin(admin)}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                        />
                      </button>

                      {/* Botón para eliminar el administrador. */}

                      <button
                        className="iconBtn deleteBtn"
                        onClick={() => eliminarAdmin(admin._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                        />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botón para registrar un nuevo administrador. */}

        <button
          type="button"
          className="newAdminBtn"
          onClick={abrirNuevoAdmin}
        >
          <FontAwesomeIcon icon={faPlus} />
          Nuevo registro
        </button>

      </div>
    </div>
  </div>
);
}




