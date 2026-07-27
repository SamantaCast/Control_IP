/* Exportación del reporte en formato Excel. */

// Importaciones.

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { Impresora } from "../dashboard/types";

// Opciones de exportación.

interface OpcionesExportacion {
  esAdmin: boolean;
  incluirReservados?: boolean;
}

// Carga una imagen desde la carpeta pública.

async function cargarImagen(
  url: string
): Promise<ArrayBuffer> {
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo cargar la imagen: ${url}`
    );
  }

  return respuesta.arrayBuffer();
}

// Genera el archivo de Excel.

export async function exportarExcel(
  impresoras: Impresora[],
  opciones: OpcionesExportacion = {
    esAdmin: false,
    incluirReservados: false,
  }
) {
  /*
   * Solo un administrador puede incluir registros
   * marcados como reservados.
   */

  const puedeIncluirReservados =
    opciones.esAdmin === true &&
    opciones.incluirReservados === true;

  /*
   * Si no tiene autorización, elimina de la exportación
   * todos los registros con reservado: true.
   */

  const impresorasExportables =
    puedeIncluirReservados
      ? impresoras
      : impresoras.filter(
          (impresora) => !impresora.reservado
        );

  // Obtiene la fecha actual.

  const fecha = new Date();

  // Crea el libro de Excel.

  const libro = new ExcelJS.Workbook();

  libro.creator = "Departamento de Informática";
  libro.company = "LICONSA";
  libro.subject = "Control Equipos de Cómputo";
  libro.title = "Control Equipos de Cómputo";
  libro.created = fecha;

  // Agrega la hoja principal.

  const hoja = libro.addWorksheet("GENERAL");

  // Configura el formato de impresión.

  hoja.pageSetup = {
    paperSize: 9,
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.35,
      bottom: 0.35,
      header: 0.15,
      footer: 0.15,
    },
  };

  // Carga los logotipos.

  const logo1 = await cargarImagen("/logos/1.png");
  const logo2 = await cargarImagen("/logos/2.png");
  const logo3 = await cargarImagen("/logos/3.png");

  // Registra los logotipos en el libro.

  const idLogo1 = libro.addImage({
    buffer: logo1,
    extension: "png",
  });

  const idLogo2 = libro.addImage({
    buffer: logo2,
    extension: "png",
  });

  const idLogo3 = libro.addImage({
    buffer: logo3,
    extension: "png",
  });

  // Inserta los logotipos en la hoja.

  hoja.addImage(idLogo1, {
    tl: {
      col: 0.1,
      row: 0.1,
    },
    ext: {
      width: 205,
      height: 60,
    },
  });

  hoja.addImage(idLogo2, {
    tl: {
      col: 1.1,
      row: 0.1,
    },
    ext: {
      width: 180,
      height: 60,
    },
  });

  hoja.addImage(idLogo3, {
    tl: {
      col: 3.15,
      row: 0.05,
    },
    ext: {
      width: 95,
      height: 60,
    },
  });

  // Combina las celdas del encabezado.

  hoja.mergeCells("A5:I5");
  hoja.mergeCells("A6:I6");

  // Configura el título.

  hoja.getRow(5).height = 28;
  hoja.getRow(6).height = 22;

  hoja.getCell("A5").value =
    "CONTROL EQUIPOS DE CÓMPUTO";

  hoja.getCell("A5").font = {
    bold: true,
    size: 20,
    color: {
      argb: "8A2036",
    },
  };

  hoja.getCell("A5").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  // Configura el subtítulo.

  hoja.getCell("A6").value =
    "Sistema de Gestión de Activos Informáticos";

  hoja.getCell("A6").font = {
    size: 12,
    color: {
      argb: "666666",
    },
  };

  hoja.getCell("A6").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  // Muestra el total de registros exportados.

  hoja.getCell("H7").value = "TOTAL:";
  hoja.getCell("I7").value =
    impresorasExportables.length;

  hoja.getCell("H7").font = {
    bold: true,
    size: 10,
    color: {
      argb: "8A2036",
    },
  };

  // Agrega una línea separadora.

  for (let columna = 1; columna <= 9; columna++) {
    hoja.getRow(8).getCell(columna).border = {
      bottom: {
        style: "medium",
        color: {
          argb: "8A2036",
        },
      },
    };
  }

  // Configura los encabezados de la tabla.

  const encabezados = [
    "DEPARTAMENTO",
    "EDIFICIO",
    "UBICACIÓN",
    "NOMBRE",
    "EMAIL",
    "EQUIPO",
    "USUARIO",
    "IP",
    "CÓDIGO",
  ];

  const filaEncabezado = hoja.getRow(9);

  encabezados.forEach((titulo, index) => {
    const celda =
      filaEncabezado.getCell(index + 1);

    celda.value = titulo;

    celda.font = {
      bold: true,
      color: {
        argb: "FFFFFF",
      },
    };

    celda.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "8A2036",
      },
    };

    celda.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    celda.border = {
      top: {
        style: "thin",
      },
      bottom: {
        style: "thin",
      },
      left: {
        style: "thin",
      },
      right: {
        style: "thin",
      },
    };
  });

  filaEncabezado.height = 24;

  // Agrega únicamente los registros permitidos.

  impresorasExportables.forEach(
    (impresora, indice) => {
      const fila = hoja.addRow([
        impresora.departamento,
        impresora.edificio,
        impresora.ubicacion,
        impresora.nombre,
        impresora.email,
        impresora.equipo,
        impresora.usuario,
        impresora.ip,
        impresora.codigo,
      ]);

      fila.height = 21;

      fila.eachCell((celda) => {
        celda.alignment = {
          vertical: "middle",
        };

        celda.border = {
          top: {
            style: "thin",
            color: {
              argb: "D9D9D9",
            },
          },
          bottom: {
            style: "thin",
            color: {
              argb: "D9D9D9",
            },
          },
          left: {
            style: "thin",
            color: {
              argb: "D9D9D9",
            },
          },
          right: {
            style: "thin",
            color: {
              argb: "D9D9D9",
            },
          },
        };
      });

      /*
      * Los registros reservados tienen prioridad
      * sobre el color alternado.
      */

      if (impresora.reservado) {
        // Colorea toda la fila horizontal reservada.

        fila.eachCell({ includeEmpty: true }, (celda) => {
          celda.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: "F8E1E7",
            },
          };

          celda.font = {
            bold: true,
            color: {
              argb: "6E192D",
            },
          };
        });
      } else if (indice % 2 === 0) {
        // Color alternado para los registros normales.

        fila.eachCell({ includeEmpty: true }, (celda) => {
          celda.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: "F7F7F7",
            },
          };
        });
      }
    }
  );

  // Activa los filtros de la tabla.

  hoja.autoFilter = {
    from: {
      row: 9,
      column: 1,
    },
    to: {
      row: 9,
      column: 9,
    },
  };

  // Configura el ancho de las columnas.

  hoja.columns = [
    { width: 34 },
    { width: 10 },
    { width: 18 },
    { width: 34 },
    { width: 36 },
    { width: 15 },
    { width: 18 },
    { width: 18 },
    { width: 12 },
  ];

  // Configura la impresión del reporte.

  hoja.pageSetup.printTitlesRow = "9:9";
  hoja.pageSetup.horizontalCentered = true;
  hoja.pageSetup.verticalCentered = false;

  hoja.headerFooter.oddFooter =
    "&LDepartamento de Informática&CControl Equipos de Cómputo&RPágina &P de &N";

  hoja.headerFooter.evenFooter =
    "&LDepartamento de Informática&CControl Equipos de Cómputo&RPágina &P de &N";

  // Genera el archivo de Excel.

  const buffer = await libro.xlsx.writeBuffer();

  const archivo = new Blob([buffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Genera el nombre del archivo.

  const nombreArchivo =
    `Control_Equipos_${fecha
      .toLocaleDateString("es-MX")
      .replace(/\//g, "-")}.xlsx`;

  // Descarga el archivo.

  saveAs(archivo, nombreArchivo);
}