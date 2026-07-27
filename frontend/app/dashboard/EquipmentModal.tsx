/* Modal para agregar y editar equipos de cómputo. */

"use client";

// Importaciones.

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faBuilding,
  faLocationDot,
  faUser,
  faEnvelope,
  faDesktop,
  faNetworkWired,
  faBarcode,
  faXmark,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import type { Impresora } from "./types";

// Propiedades del componente.

interface Props {
  mostrarFormulario: boolean;
  editandoId: string | null;
  form: Impresora;
  setForm: React.Dispatch<React.SetStateAction<Impresora>>;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  guardar: () => void;

  setMostrarFormulario: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  setEditandoId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

// Componente principal.

export default function EquipmentModal({
  mostrarFormulario,
  editandoId,
  form,
  setForm,
  handleChange,
  guardar,
  setMostrarFormulario,
  setEditandoId,
}: Props) {

  // Verifica que el formulario esté visible.

  if (!mostrarFormulario) return null;

  return (
    <div className="overlayStyle">

      {/* Modal del formulario. */}

      <div className="modalStyle">

        {/* Botón para cerrar el modal. */}

        <button
          type="button"
          className="closeModalBtn"
          onClick={() => {
            setMostrarFormulario(false);
            setEditandoId(null);
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* Encabezado del modal. */}

        <div className="modalHeader">
          <div className="modalHeaderIcon">
            <FontAwesomeIcon
              icon={faClipboardList}
            />
          </div>

          <div>
            <h2 className="modalTitle">
              {editandoId
                ? "Editar registro"
                : "Agregar registro"}
            </h2>

            <p className="modalDescription">
              Complete la información correspondiente
              al equipo de cómputo.
            </p>
          </div>
        </div>

        <div className="modalDivider"></div>

        {/* Sección de datos generales. */}

        <div className="formSection">
          <div className="sectionHeader">
            <div className="sectionIcon">
              <FontAwesomeIcon
                icon={faClipboardList}
              />
            </div>

            <h3 className="sectionTitle">
              Datos Generales
            </h3>
          </div>

          <div className="formGrid">

            {/* Campo para el departamento. */}

            <div className="inputWrapper">
              <div className="inputIcon">
                <FontAwesomeIcon
                  icon={faBuilding}
                />
              </div>

              <input
                className="formInput"
                name="departamento"
                placeholder="Departamento"
                value={form.departamento}
                onChange={handleChange}
              />
            </div>

            {/* Campo para el edificio. */}

            <div className="inputWrapper">
              <div className="inputIcon">
                <FontAwesomeIcon
                  icon={faBuilding}
                />
              </div>

              <input
                className="formInput"
                name="edificio"
                placeholder="Edificio"
                value={form.edificio}
                onChange={handleChange}
              />
            </div>

            {/* Campo para la ubicación. */}

            <div className="inputWrapper">
              <div className="inputIcon">
                <FontAwesomeIcon
                  icon={faLocationDot}
                />
              </div>

              <input
                className="formInput"
                name="ubicacion"
                placeholder="Ubicación"
                value={form.ubicacion}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>

        {/* Sección del responsable del equipo. */}

        <div className="formSection">
          <div className="sectionHeader">
            <div className="sectionIcon">
              <FontAwesomeIcon icon={faUser} />
            </div>

            <h3 className="sectionTitle">
              Responsable
            </h3>
          </div>

          <div className="formGrid">

                      {/* Campo para el nombre del responsable. */}

          <div className="inputWrapper">
            <div className="inputIcon">
              <FontAwesomeIcon icon={faUser} />
            </div>

            <input
              className="formInput"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          {/* Campo para el correo electrónico. */}

          <div className="inputWrapper">
            <div className="inputIcon">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>

            <input
              className="formInput"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Campo para el usuario. */}

          <div className="inputWrapper">
            <div className="inputIcon">
              <FontAwesomeIcon icon={faUser} />
            </div>

            <input
              className="formInput"
              name="usuario"
              placeholder="Usuario"
              value={form.usuario}
              onChange={handleChange}
            />
          </div>

        </div>
      </div>

      {/* Sección de información del equipo. */}

      <div className="formSection">
        <div className="sectionHeader">
          <div className="sectionIcon">
            <FontAwesomeIcon icon={faDesktop} />
          </div>

          <h3 className="sectionTitle">
            Equipo
          </h3>
        </div>

        <div className="formGrid">

          {/* Campo para el nombre del equipo. */}

          <div className="inputWrapper">
            <div className="inputIcon">
              <FontAwesomeIcon icon={faDesktop} />
            </div>

            <input
              className="formInput"
              name="equipo"
              placeholder="Equipo"
              value={form.equipo}
              onChange={handleChange}
            />
          </div>

          {/* Campo para la dirección IP. */}

          <div className="inputWrapper">
            <div className="inputIcon">
              <FontAwesomeIcon icon={faNetworkWired} />
            </div>

            <input
              className="formInput"
              name="ip"
              placeholder="Dirección IP"
              value={form.ip}
              onChange={handleChange}
            />
          </div>

          {/* Campo para el código del equipo. */}

          <div className="inputWrapper">
            <div className="inputIcon">
              <FontAwesomeIcon icon={faBarcode} />
            </div>

            <input
              className="formInput"
              name="codigo"
              placeholder="Código"
              value={form.codigo}
              onChange={handleChange}
            />
          </div>

        </div>
      </div>
      
      <div className="switchGroup">

        <div className="sectionTitle">
          
          <div className="sectionIcon">
            <FontAwesomeIcon icon={faLock} />
          </div>

          <span>
            Reservado
          </span>

        </div>

        <label className="switch">

          <input
            type="checkbox"
            checked={form.reservado}
            onChange={(e) =>
              setForm({
                ...form,
                reservado: e.target.checked,
              })
            }
          />

          <span className="slider"></span>

        </label>

      </div>

      {/* Pie del modal. */}

      <div className="modalFooter">

        {/* Botón para cancelar la operación. */}

        <button
          type="button"
          className="cancelBtn"
          onClick={() => {
            setMostrarFormulario(false);
            setEditandoId(null);
          }}
        >
          Cancelar
        </button>

        {/* Botón para guardar o actualizar el registro. */}

        <button
          type="button"
          className="saveBtn"
          onClick={guardar}
        >
          {editandoId
            ? "Actualizar"
            : "Guardar"}
        </button>

      </div>
    </div>
  </div>
);
}