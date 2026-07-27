/* Componente de búsqueda, filtros y acciones. */

"use client";

// Importaciones.

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  faList,
  faPlus,
  faSearch,
  faDesktop,
  faUsers,
  faNetworkWired,
  faLock,
  faFileExcel,
  faFilePdf,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import type { Impresora } from "./types";

// Propiedades del componente.

interface SearchBarProps {

  // Estado del usuario.

  logueado: boolean;
  token: string;
  impresoras: Impresora[];

  // Estado del buscador.

  busqueda: string;
  setBusqueda: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Filtro por edificio.

  filtroEdificio: string;
  setFiltroEdificio: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Listas de filtros.

  edificios: string[];
  departamentos: string[];
  ubicaciones: string[];
  equipos: string[];

  // Filtro por departamento.

  filtroDepartamento: string;
  setFiltroDepartamento: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Filtro por ubicación.

  filtroUbicacion: string;
  setFiltroUbicacion: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Filtro por equipo.

  filtroEquipo: string;
  setFiltroEquipo: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Filtro por estado.

  filtroReservado: string;
  setFiltroReservado: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Estadísticas del sistema.

  stats: {
    totalEquipos: number;
    equiposActivos: number;
    totalUsuarios: number;
    totalIPs: number;
    ipsReservadas: number;
  };

  // Funciones.

  abrirNuevo: () => void;
  exportarExcel: () => void;
  exportarPDF: () => void;
}

// Componente principal.

export default function SearchBar({
  logueado,
  impresoras,
  token,
  busqueda,
  setBusqueda,
  filtroEdificio,
  setFiltroEdificio,
  edificios,
  stats,
  abrirNuevo,
  exportarExcel,
  exportarPDF,
  departamentos,
  ubicaciones,
  equipos,
  filtroDepartamento,
  setFiltroDepartamento,
  filtroUbicacion,
  setFiltroUbicacion,
  filtroEquipo,
  setFiltroEquipo,
  filtroReservado,
  setFiltroReservado,
}: SearchBarProps) {

  const [
    mostrarFiltrosMovil,
    setMostrarFiltrosMovil,
  ] = useState(false);

  const limpiar = (v?: string) =>
    v?.trim() || "";

  const unicos = (arr: string[]) =>
    [...new Set(arr.filter(Boolean))].sort((a, b) =>
      a.localeCompare(b)
    );

  const departamentosFiltrados = unicos(
    impresoras
      .filter(
        (i) =>
          (!filtroEdificio || limpiar(i.edificio) === limpiar(filtroEdificio)) &&
          (!filtroUbicacion || limpiar(i.ubicacion) === limpiar(filtroUbicacion)) &&
          (!filtroEquipo || limpiar(i.equipo) === limpiar(filtroEquipo)) &&
          (!filtroReservado || String(i.reservado) === filtroReservado)
      )
      .map((i) => limpiar(i.departamento))
  );

  const edificiosFiltrados = unicos(
    impresoras
      .filter(
        (i) =>
          (!filtroDepartamento || limpiar(i.departamento) === limpiar(filtroDepartamento)) &&
          (!filtroUbicacion || limpiar(i.ubicacion) === limpiar(filtroUbicacion)) &&
          (!filtroEquipo || limpiar(i.equipo) === limpiar(filtroEquipo)) &&
          (!filtroReservado || String(i.reservado) === filtroReservado)
      )
      .map((i) => limpiar(i.edificio))
  );

  const ubicacionesFiltradas = unicos(
    impresoras
      .filter(
        (i) =>
          (!filtroDepartamento || limpiar(i.departamento) === limpiar(filtroDepartamento)) &&
          (!filtroEdificio || limpiar(i.edificio) === limpiar(filtroEdificio)) &&
          (!filtroEquipo || limpiar(i.equipo) === limpiar(filtroEquipo)) &&
          (!filtroReservado || String(i.reservado) === filtroReservado)
      )
      .map((i) => limpiar(i.ubicacion))
  );

  const equiposFiltrados = unicos(
    impresoras
      .filter(
        (i) =>
          (!filtroDepartamento || limpiar(i.departamento) === limpiar(filtroDepartamento)) &&
          (!filtroEdificio || limpiar(i.edificio) === limpiar(filtroEdificio)) &&
          (!filtroUbicacion || limpiar(i.ubicacion) === limpiar(filtroUbicacion)) &&
          (!filtroReservado || String(i.reservado) === filtroReservado)
      )
      .map((i) => limpiar(i.equipo))
  );


  return (
    <>

      {/* Encabezado del panel. */}

      <div className="panelHeader">

        {/* Título del sistema. */}

        <div className="headerTopRow">

          <div className="titleArea">

            

            

          </div>

          {/* Tarjetas de estadísticas. */}

          <div
            className={`statsArea ${
              logueado ? "statsAreaLogged" : ""
            }`}
          >

            {/* Tarjeta de equipos registrados. */}

            <div className="statCard">

              <div className="statIcon">
                <FontAwesomeIcon icon={faDesktop} />
              </div>

              <div>

                <span className="statLabel">
                  Equipos
                </span>

                <h3 className="statNumber">
                  {stats.totalEquipos.toLocaleString()}
                </h3>

                <small className="statSmall">
                  Registros
                </small>

              </div>

            </div>

            {/* Tarjeta de usuarios registrados. */}

            <div className="statCard">

              <div className="statIcon users">
                <FontAwesomeIcon icon={faUsers} />
              </div>

              <div>

                <span className="statLabel">
                  Usuarios
                </span>

                <h3 className="statNumber">
                  {stats.totalUsuarios.toLocaleString()}
                </h3>

                <small className="statSmall">
                  Registrados
                </small>

              </div>

            </div>

            {/* Tarjeta de direcciones IP registradas. */}

            <div className="statCard">

              <div className="statIcon ip">
                <FontAwesomeIcon
                  icon={faNetworkWired}
                />
              </div>

              <div>

                <span className="statLabel">
                  IPs 
                </span>

                <h3 className="statNumber">
                  {stats.totalIPs.toLocaleString()}
                </h3>

                <small className="statSmall">
                  Asignadas
                </small>

              </div>

            </div>

            {/* Tarjeta de IPs reservadas. */}

            {logueado && (
              <div className="statCard">

                <div className="statIcon ip">
                  <FontAwesomeIcon icon={faLock} />
                </div>

                <div>

                  <span className="statLabel">
                    IPs reservadas
                  </span>

                  <h3 className="statNumber">
                    {stats.ipsReservadas.toLocaleString()}
                  </h3>

                  <small className="statSmall">
                    Asignadas
                  </small>

                </div>

              </div>
            )}

          </div>

        </div>

                {/* Barra de acciones. */}

        <div className="filtersCard">

          {/* Fila de filtros. */}

          <div className="filtersRow">

  {/* Buscador. */}

  <div className="searchBox">
    <FontAwesomeIcon
      icon={faSearch}
      className="searchIcon"
    />

    <input
      type="text"
      className="searchInput"
      placeholder="Buscar..."
      value={busqueda}
      onChange={(e) =>
        setBusqueda(e.target.value)
      }
    />
  </div>

  {/* Botón móvil para abrir los filtros. */}

  <button
    type="button"
    className="mobileFiltersButton"
    onClick={() =>
      setMostrarFiltrosMovil(
        (valorAnterior) => !valorAnterior
      )
    }
    aria-expanded={mostrarFiltrosMovil}
    aria-controls="filtersMobilePanel"
  >
    <FontAwesomeIcon
      icon={
        mostrarFiltrosMovil
          ? faXmark
          : faBars
      }
    />

    <span>
      {mostrarFiltrosMovil
        ? "Cerrar filtros"
        : "Filtros"}
    </span>
  </button>

  {/* Contenedor de filtros. */}

<div
  id="filtersMobilePanel"
  className={`filtersRight ${
    mostrarFiltrosMovil
      ? "filtersMobileOpen"
      : ""
  }`}
>
  {/* Filtro por departamento. */}

  <div className="filterItem filterItemDepartamento">
    <select
      className="filterSelect"
      value={filtroDepartamento}
      onChange={(e) =>
        setFiltroDepartamento(e.target.value)
      }
    >
      <option value="">
        DEPARTAMENTO
      </option>

      {departamentosFiltrados.map((item) => (
        <option
          key={item}
          value={item}
        >
          {item}
        </option>
      ))}
    </select>
  </div>

  {/* Filtro por edificio. */}

  <div className="filterItem">
    <select
      className="filterSelect"
      value={filtroEdificio}
      onChange={(e) =>
        setFiltroEdificio(e.target.value)
      }
    >
      <option value="">
        EDIFICIO
      </option>

      {edificiosFiltrados.map((edificio) => (
        <option
          key={edificio}
          value={edificio}
        >
          {edificio}
        </option>
      ))}
    </select>
  </div>

  {/* Filtro por ubicación. */}

  <div className="filterItem">
    <select
      className="filterSelect"
      value={filtroUbicacion}
      onChange={(e) =>
        setFiltroUbicacion(e.target.value)
      }
    >
      <option value="">
        UBICACIÓN
      </option>

      {ubicacionesFiltradas.map((item) => (
        <option
          key={item}
          value={item}
        >
          {item}
        </option>
      ))}
    </select>
  </div>

  {/* Filtro por equipo. */}

  <div className="filterItem">
    <select
      className="filterSelect"
      value={filtroEquipo}
      onChange={(e) =>
        setFiltroEquipo(e.target.value)
      }
    >
      <option value="">
        EQUIPO
      </option>

      {equiposFiltrados.map((item) => (
        <option
          key={item}
          value={item}
        >
          {item}
        </option>
      ))}
    </select>
  </div>

  {/* Filtro por estado reservado. */}

  {logueado && (
    <div className="filterItem">
      <select
        className="filterSelect"
        value={filtroReservado}
        onChange={(e) =>
          setFiltroReservado(e.target.value)
        }
      >
        <option value="">
          ESTADO
        </option>

        <option value="true">
          RESERVADO
        </option>

        <option value="false">
          NO RESERVADO
        </option>
      </select>
    </div>
  )}

  {/* Botón para limpiar los filtros. */}

  <button
    type="button"
    className="btnClearMini"
    onClick={() => {
      setBusqueda("");
      setFiltroDepartamento("");
      setFiltroEdificio("");
      setFiltroUbicacion("");
      setFiltroEquipo("");
      setFiltroReservado("");
      setMostrarFiltrosMovil(false);
    }}
  >
    Limpiar filtros
  </button>
</div>

          </div>
                  {/* Botones de acciones. */}

        <div className="actionsRow">

          {/* Botones de exportación. */}

          {logueado && (
            <div className="leftButtons">

              <button
                className="btnExcel"
                onClick={exportarExcel}
              >
                <FontAwesomeIcon icon={faFileExcel} />
                Exportar Excel
              </button>

              <button
                className="btnPDF"
                onClick={exportarPDF}
              >
                <FontAwesomeIcon icon={faFilePdf} />
                Exportar PDF
              </button>

            </div>
          )}

          {/* Botón para agregar un registro. */}

          <div className="rightButtons">

            {logueado && (
              <button
                className="dashboardNewBtn"
                onClick={abrirNuevo}
              >
                <FontAwesomeIcon icon={faPlus} />
                Nuevo registro
              </button>
            )}

          </div>

        </div>

      </div>

    </div>

  </>
);
}