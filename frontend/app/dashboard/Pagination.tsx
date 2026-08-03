/* Componente de paginación de registros. */

"use client";

// Importaciones.

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import type { Impresora } from "./types";

// Propiedades del componente.

interface Props {
  // Registros mostrados en la tabla.

  impresoras: Impresora[];

  // Índices de los registros visibles.

  indiceInicio: number;
  indiceFin: number;

  // Estado de la paginación.

  paginaActual: number;
  totalPaginas: number;

  // Actualiza la página actual.

  setPaginaActual: React.Dispatch<
    React.SetStateAction<number>
  >;

  // Configuración de registros por página.

  registrosPorPagina: number;

  setRegistrosPorPagina: React.Dispatch<
    React.SetStateAction<number>
  >;
}

// Componente principal.

export default function Pagination({
  impresoras,
  indiceInicio,
  indiceFin,
  paginaActual,
  totalPaginas,
  setPaginaActual,
  registrosPorPagina,
  setRegistrosPorPagina,
}: Props) {
  // Controla la visibilidad de la paginación en celular.

  const [
    mostrarPaginacionMovil,
    setMostrarPaginacionMovil,
  ] = useState(false);

  // Genera la lista de páginas que se mostrarán.

  const obtenerPaginas = (): (number | string)[] => {
    if (totalPaginas <= 7) {
      return Array.from(
        { length: totalPaginas },
        (_, indice) => indice + 1
      );
    }

    // Primeras páginas.

    if (paginaActual <= 4) {
      return [
        1,
        2,
        3,
        4,
        5,
        "...",
        totalPaginas,
      ];
    }

    // Últimas páginas.

    if (paginaActual >= totalPaginas - 3) {
      return [
        1,
        "...",
        totalPaginas - 4,
        totalPaginas - 3,
        totalPaginas - 2,
        totalPaginas - 1,
        totalPaginas,
      ];
    }

    // Páginas intermedias.

    return [
      1,
      "...",
      paginaActual - 1,
      paginaActual,
      paginaActual + 1,
      "...",
      totalPaginas,
    ];
  };

  // Cambia la página y cierra el panel móvil.

  const cambiarPagina = (
    nuevaPagina: number
  ) => {
    if (
      nuevaPagina < 1 ||
      nuevaPagina > totalPaginas
    ) {
      return;
    }

    setPaginaActual(nuevaPagina);
  };

  return (
    <div className="tablePagination">

      {/* Información de los registros mostrados. */}

      <div className="paginationInfo">
        <span>Mostrando</span>

        <strong>
          {impresoras.length === 0
            ? 0
            : indiceInicio + 1}
          {" - "}
          {Math.min(
            indiceFin,
            impresoras.length
          )}
        </strong>

        <span>de</span>

        <strong>
          {impresoras.length}
        </strong>

        <span>registros</span>
      </div>

      {/* Botón móvil para mostrar los controles. */}

      <button
        type="button"
        className="mobilePaginationButton"
        onClick={() =>
          setMostrarPaginacionMovil(
            (valorAnterior) =>
              !valorAnterior
          )
        }
        aria-expanded={
          mostrarPaginacionMovil
        }
        aria-controls="paginationMobilePanel"
        aria-label={
          mostrarPaginacionMovil
            ? "Cerrar opciones de paginación"
            : "Mostrar opciones de paginación"
        }
        title={
          mostrarPaginacionMovil
            ? "Cerrar paginación"
            : "Mostrar paginación"
        }
      >
        <FontAwesomeIcon
          icon={
            mostrarPaginacionMovil
              ? faXmark
              : faBars
          }
        />

        <span>
          {mostrarPaginacionMovil
            ? "Cerrar"
            : `Página ${paginaActual}`}
        </span>
      </button>

      {/* Panel con la navegación y el selector. */}

      <div
        id="paginationMobilePanel"
        className={`paginationMobilePanel ${
          mostrarPaginacionMovil
            ? "paginationMobileOpen"
            : ""
        }`}
      >
        {/* Navegación entre páginas. */}

        <div className="paginationControls">
          {/* Página anterior. */}

          <button
            type="button"
            className="pageBtn pageArrow"
            disabled={paginaActual === 1}
            onClick={() =>
              cambiarPagina(
                paginaActual - 1
              )
            }
            aria-label="Página anterior"
            title="Página anterior"
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
            />
          </button>

          {/* Botones de páginas. */}

          {obtenerPaginas().map(
            (item, index) =>
              typeof item === "string" ? (
                <span
                  key={`dots-${index}`}
                  className="pageDots"
                  aria-hidden="true"
                >
                  ...
                </span>
              ) : (
                <button
                  type="button"
                  key={`page-${item}-${index}`}
                  className={`pageBtn ${
                    paginaActual === item
                      ? "activePageBtn"
                      : ""
                  }`}
                  onClick={() =>
                    cambiarPagina(item)
                  }
                  aria-current={
                    paginaActual === item
                      ? "page"
                      : undefined
                  }
                >
                  {item}
                </button>
              )
          )}

          {/* Página siguiente. */}

          <button
            type="button"
            className="pageBtn pageArrow"
            disabled={
              paginaActual === totalPaginas ||
              totalPaginas === 0
            }
            onClick={() =>
              cambiarPagina(
                paginaActual + 1
              )
            }
            aria-label="Página siguiente"
            title="Página siguiente"
          >
            <FontAwesomeIcon
              icon={faChevronRight}
            />
          </button>
        </div>

        {/* Selector de registros por página. */}

        <div className="rowsPerPage">
          <label htmlFor="registrosPorPagina">
            Mostrar
          </label>

          <select
            id="registrosPorPagina"
            value={registrosPorPagina}
            onChange={(evento) => {
            setPaginaActual(1);

            setRegistrosPorPagina(
              Number(evento.target.value)
            );
          }}
          >
            <option value={15}>
              15
            </option>

            <option value={25}>
              25
            </option>

            <option value={50}>
              50 registros
            </option>

            <option value={100}>
              100
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}