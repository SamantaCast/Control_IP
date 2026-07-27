/* Tabla para visualizar y administrar los registros de equipos. */

"use client";

// Importaciones.

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faArrowUp,
  faArrowDown,
  faArrowsUpDown,
} from "@fortawesome/free-solid-svg-icons";
import type { Impresora } from "./types";

// Propiedades del componente.

interface Props {
  impresoras: Impresora[];
  impresorasPaginadas: Impresora[];
  logueado: boolean;
  abrirEditar: (imp: Impresora) => void;
  eliminar: (id?: string) => void;
  ordenarPor: (campo: string) => void;
  ordenCampo: string;
  ordenDireccion: "asc" | "desc";
}

// Componente principal.

export default function EquipmentTable({
  impresoras,
  impresorasPaginadas,
  logueado,
  abrirEditar,
  eliminar,
  ordenarPor,
  ordenCampo,
  ordenDireccion,
}: Props) {

  // Devuelve el ícono correspondiente al orden actual de la columna.

  const iconoOrden = (campo: string) => {
    if (ordenCampo !== campo) {
      return faArrowsUpDown;
    }

    return ordenDireccion === "asc"
      ? faArrowUp
      : faArrowDown;
  };

  return (

    <div className="tableBox">

      {/* Tabla de registros. */}

      <table className="dataTable">

        {/* Encabezado de la tabla. */}

        <thead>
          <tr>

            {/* Columna de departamento. */}

            <th
              className="tableHeadCell sortable"
              onClick={() => ordenarPor("departamento")}
            >
              Departamento

              <FontAwesomeIcon
                icon={iconoOrden("departamento")}
                className="sortIcon"
              />
            </th>

            {/* Columna de edificio. */}

            <th
              className="tableHeadCell sortable"
              onClick={() => ordenarPor("edificio")}
            >
              Edificio

              <FontAwesomeIcon
                icon={iconoOrden("edificio")}
                className="sortIcon"
              />
            </th>

            {/* Columna de ubicación. */}

            <th
              className="tableHeadCell sortable"
              onClick={() => ordenarPor("ubicacion")}
            >
              Ubicación

              <FontAwesomeIcon
                icon={iconoOrden("ubicacion")}
                className="sortIcon"
              />
            </th>

            {/* Columna del nombre. */}

            <th
              className="tableHeadCell sortable"
              onClick={() => ordenarPor("nombre")}
            >
              Nombre

              <FontAwesomeIcon
                icon={iconoOrden("nombre")}
                className="sortIcon"
              />
            </th>

            {/* Columna del correo electrónico. */}

            <th
              className="tableHeadCell sortable"
              onClick={() => ordenarPor("email")}
            >
              Email

              <FontAwesomeIcon
                icon={iconoOrden("email")}
                className="sortIcon"
              />
            </th>

            {/* Columna del equipo. */}

            <th
              className="tableHeadCell sortable"
              onClick={() => ordenarPor("equipo")}
            >
              Equipo

              <FontAwesomeIcon
                icon={iconoOrden("equipo")}
                className="sortIcon"
              />
            </th>

                        {/* Columna del usuario. */}

            <th
              className="tableHeadCell sortable"
              onClick={() => ordenarPor("usuario")}
            >
              Usuario

              <FontAwesomeIcon
                icon={iconoOrden("usuario")}
                className="sortIcon"
              />
            </th>

            {/* Columna de la dirección IP. */}

            <th
              className="tableHeadCell sortable"
              onClick={() => ordenarPor("ip")}
            >
              IP

              <FontAwesomeIcon
                icon={iconoOrden("ip")}
                className="sortIcon"
              />
            </th>

            {/* Columna del código. */}

            <th
              className="tableHeadCell sortable"
              onClick={() => ordenarPor("codigo")}
            >
              Código

              <FontAwesomeIcon
                icon={iconoOrden("codigo")}
                className="sortIcon"
              />
            </th>

            {/* Columna de Estado. */}

            {logueado && (
              <th className="tableHeadCell">
                Estado
              </th>
            )}

            {/* Columna de acciones. */}

            {logueado && (
              <th className="tableHeadCell">
                Acciones
              </th>
            )}

          </tr>
        </thead>

        {/* Cuerpo de la tabla. */}

        <tbody>

          {/* Mensaje cuando no existen registros. */}

          {impresoras.length === 0 ? (
            <tr>
              <td
                colSpan={logueado ? 11 : 9}
                className="emptyState"
              >
                No se encontraron registros
              </td>
            </tr>
          ) : (

            // Registros de equipos.

            impresorasPaginadas.map((imp) => (
              <tr key={imp._id}>

                <td className="tableCell">
                  {imp.departamento}
                </td>

                <td className="tableCell">
                  {imp.edificio}
                </td>

                <td className="tableCell">
                  {imp.ubicacion}
                </td>

                <td className="tableCell">
                  {imp.nombre}
                </td>

                <td className="tableCell">
                  {imp.email}
                </td>

                <td className="tableCell">
                  {imp.equipo}
                </td>

                <td className="tableCell">
                  {imp.usuario}
                </td>

                <td className="tableCell">
                  {imp.ip}
                </td>

                <td className="tableCell">
                  {imp.codigo}
                </td>

                {/* Acciones disponibles. */}

                {logueado && (
                <td className="tableCell">
                  {imp.reservado && (
                    <span className="status reservado">
                      Reservado
                    </span>
                  )}
                </td>
              )}

                {/* Acciones disponibles. */}

                {logueado && (
                  <td className="tableCell">
                    <div className="actionBtns">

                      {/* Botón para editar el registro. */}

                      <button
                        className="iconBtn editBtn"
                        onClick={() => abrirEditar(imp)}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                        />
                      </button>

                      {/* Botón para eliminar el registro. */}

                      <button
                        className="iconBtn deleteBtn"
                        onClick={() => eliminar(imp._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                        />
                      </button>

                    </div>
                  </td>
                )}

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}