/* Encabezado del sistema con acceso de usuario y autenticación. */

"use client";

// Importaciones.

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  faUser,
  faRightFromBracket,
  faXmark,
  faUsers,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

// Propiedades del componente.

type HeaderProps = {
  logueado: boolean;
  usuario: string;
  password: string;
  nombreUsuario: string;
  rol: string;
  mostrarMenuUsuario: boolean;

  setMostrarMenuUsuario: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  mostrarLogin: boolean;

  setMostrarLogin: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  abrirAdministradoresRegistrados: () => void;
  cerrarSesion: () => void;
  login: () => void;

  setUsuario: React.Dispatch<
    React.SetStateAction<string>
  >;

  setPassword: React.Dispatch<
    React.SetStateAction<string>
  >;
};

// Componente principal.

export default function Header({
  logueado,
  usuario,
  password,
  nombreUsuario,
  rol,
  abrirAdministradoresRegistrados,
  mostrarMenuUsuario,
  setMostrarMenuUsuario,
  mostrarLogin,
  setMostrarLogin,
  cerrarSesion,
  login,
  setUsuario,
  setPassword,
}: HeaderProps) {

  // Referencias utilizadas para detectar clics fuera del menú y del formulario.

  const menuRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLFormElement>(null);
  
  const [
    mostrarPasswordLogin,
    setMostrarPasswordLogin,
  ] = useState(false);

  // Cierra el menú de usuario y el formulario de inicio de sesión
  // cuando el usuario hace clic fuera de ellos.

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {

      // Cierra el menú de usuario.

      if (
        mostrarMenuUsuario &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMostrarMenuUsuario(false);
      }

      // Cierra el formulario de inicio de sesión.

      if (
        mostrarLogin &&
        loginRef.current &&
        !loginRef.current.contains(event.target as Node)
      ) {
        setMostrarLogin(false);
      }
    }

    // Registra el evento para detectar clics fuera de los elementos.

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    // Elimina el evento al desmontar el componente.

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, [
    mostrarMenuUsuario,
    mostrarLogin,
    setMostrarMenuUsuario,
    setMostrarLogin,
  ]);

  return (
    <>

      {/* Barra superior del sistema. */}

      <div
        className={`topBar ${
          logueado ? "topBarLogged" : ""
        }`}
      >

        {/* Logotipos institucionales. */}

        <div className="logosLeft">
          <img
            src="/logos/1.png"
            alt="Logo 1"
            className="topLogo"
          />

          <span className="logoDivider">
            |
          </span>

          <img
            src="/logos/2.png"
            alt="Logo 2"
            className="topLogo"
          />

          <img
            src="/logos/3.png"
            alt="Logo 3"
            className="topLogo"
          />
        </div>

        {/* Información del usuario e inicio de sesión. */}

        <div style={{ position: "relative" }}>
          {logueado ? (
      
          <div
            className="userMenuContainer"
            ref={menuRef}
          >

            {/* Botón para mostrar el menú del usuario. */}

            <button
              type="button"
              className="userProfileBtn"
              onClick={() =>
                setMostrarMenuUsuario(
                  !mostrarMenuUsuario
                )
              }
            >

              {/* Avatar del usuario. */}

              <div className="userAvatar">
                <FontAwesomeIcon
                  icon={faUser}
                />
              </div>

              {/* Información del usuario. */}

              <div className="userInfo">
                <span className="userName">
                  {(nombreUsuario ||
                    usuario ||
                    "ADMIN").toUpperCase()}
                </span>

                <span className="userRole">
                  Rol: {(rol || "").toUpperCase()}
                </span>
              </div>

              {/* Indicador del menú desplegable. */}

              <span className="userArrow">
                ▼
              </span>

            </button>

            {/* Menú desplegable del usuario. */}

            {mostrarMenuUsuario && (
              <div className="userDropdown">

                {/* Opción para visualizar los administradores registrados. */}

                <button
                  className="dropdownItem"
                  onClick={() => {
                    setMostrarMenuUsuario(false);
                    abrirAdministradoresRegistrados();
                  }}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  Ver administradores registrados
                </button>

                {/* Opción para cerrar la sesión. */}

                <button
                  className="dropdownItem"
                  onClick={() => {
                    setMostrarMenuUsuario(false);
                    cerrarSesion();
                  }}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Cerrar sesión
                </button>

              </div>
            )}

          </div>

        ) : (

          // Formulario de inicio de sesión.

          <>

            {/* Botón para mostrar el formulario de inicio de sesión. */}

            <button
              className="loginIconBtn"
              onClick={() =>
                setMostrarLogin(!mostrarLogin)
              }
            >
              <FontAwesomeIcon icon={faUser} />
            </button>

            {/* Formulario de inicio de sesión. */}

            {mostrarLogin && (
              <form
                ref={loginRef}
                className="loginBox"
                onSubmit={(e) => {
                  e.preventDefault();
                  login();
                }}
              >

                <div className="loginInputs">

                  {/* Campo para el nombre de usuario. */}

                  <div className="inputGroup">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="inputIcon"
                    />

                    <input
                      type="text"
                      placeholder="Usuario"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </div>

                  {/* Campo para la contraseña. */}

                  <div className="inputGroup">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="inputIcon"
                  />

                  <input
                    type={
                      mostrarPasswordLogin
                        ? "text"
                        : "password"
                    }
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="loginPasswordEyeBtn"
                    onClick={() =>
                      setMostrarPasswordLogin(
                        (valorAnterior) => !valorAnterior
                      )
                    }
                    aria-label={
                      mostrarPasswordLogin
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    title={
                      mostrarPasswordLogin
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    <FontAwesomeIcon
                      icon={
                        mostrarPasswordLogin
                          ? faEyeSlash
                          : faEye
                      }
                    />
                  </button>
                </div>

                  {/* Botón para iniciar sesión. */}

                  <button
                    type="submit"
                    className="btnLogin"
                  >
                    Iniciar sesión
                  </button>

                </div>
              </form>
            )}

          </>
        )}

      </div>
    </div>
  </>
);
}
