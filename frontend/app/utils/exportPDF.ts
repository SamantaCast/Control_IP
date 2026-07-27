/* Exportación del reporte en formato PDF. */

// Importaciones.

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Impresora } from "../dashboard/types";

// Opciones de exportación.

interface OpcionesExportacion {
  esAdmin: boolean;
  incluirReservados: boolean;
}

// Convierte una imagen a formato Base64.

async function cargarImagen(
  url: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => {
      const canvas =
        document.createElement("canvas");

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(
          "No fue posible crear el Canvas."
        );
        return;
      }

      ctx.drawImage(img, 0, 0);

      resolve(
        canvas.toDataURL("image/png")
      );
    };

    img.onerror = () => {
      reject(
        `No fue posible cargar ${url}`
      );
    };
  });
}

// Genera el reporte en formato PDF.

export async function exportarPDF(
  impresoras: Impresora[],
  opciones: OpcionesExportacion
) {
  /*
   * Solo un administrador puede incluir registros
   * marcados como reservados.
   */

  const puedeIncluirReservados =
    opciones.esAdmin === true &&
    opciones.incluirReservados === true;

  /*
   * Si el administrador no lo autoriza, se eliminan
   * de la exportación los registros reservados.
   */

  const impresorasExportables =
    puedeIncluirReservados
      ? impresoras
      : impresoras.filter(
          (impresora) =>
            !impresora.reservado
        );

  // Crea el documento PDF.

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Carga los logotipos.

  const logo1 =
    await cargarImagen("/logos/1.png");

  const logo2 =
    await cargarImagen("/logos/2.png");

  const logo3 =
    await cargarImagen("/logos/3.png");

  // Obtiene la fecha actual.

  const fecha = new Date();

  // Genera la tabla del reporte.

  autoTable(doc, {
    startY: 59,

    theme: "grid",

    margin: {
      top: 12,
      left: 10,
      right: 10,
      bottom: 20,
    },

    head: [[
      "Departamento",
      "Edificio",
      "Ubicación",
      "Nombre",
      "Email",
      "Equipo",
      "Usuario",
      "IP",
      "Código",
    ]],

    body: impresorasExportables.map(
      (impresora) => [
        impresora.departamento,
        impresora.edificio,
        impresora.ubicacion,
        impresora.nombre,
        impresora.email,
        impresora.equipo,
        impresora.usuario,
        impresora.ip,
        impresora.codigo,
      ]
    ),

    headStyles: {
      fillColor: [138, 32, 54],
      textColor: [255, 255, 255],
      halign: "center",
      fontStyle: "bold",
    },

    styles: {
      fontSize: 7,
      cellPadding: 1.6,
      overflow: "linebreak",
    },

    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },

    /*
     * Colorea toda la fila horizontal cuando
     * el registro está marcado como reservado.
     */

    didParseCell: (data) => {
      // Solo modifica las filas del cuerpo.

      if (data.section !== "body") {
        return;
      }

      const impresora =
        impresorasExportables[data.row.index];

      if (impresora?.reservado) {
        // Fondo rosa claro.

        data.cell.styles.fillColor = [
          248,
          225,
          231,
        ];

        // Texto color vino.

        data.cell.styles.textColor = [
          110,
          25,
          45,
        ];

        // Texto en negrita.

        data.cell.styles.fontStyle =
          "bold";
      }
    },

    // Configura el encabezado de la primera página.

    willDrawPage: (data) => {
      // Muestra el encabezado únicamente
      // en la primera página.

      if (data.pageNumber !== 1) return;

      // Inserta los logotipos.

      doc.addImage(
        logo1,
        "PNG",
        10,
        10,
        43,
        13
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(18);
      doc.setTextColor(170);

      doc.text(
        "|",
        55,
        18
      );

      doc.addImage(
        logo2,
        "PNG",
        59,
        10,
        39,
        13
      );

      doc.addImage(
        logo3,
        "PNG",
        101,
        9,
        26,
        13
      );

      // Agrega el título del reporte.

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(22);

      doc.setTextColor(
        138,
        32,
        54
      );

      doc.text(
        "Control Equipos de Cómputo",
        165,
        35,
        {
          align: "center",
        }
      );

      // Agrega el subtítulo.

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(11);

      doc.setTextColor(90);

      doc.text(
        "Sistema de Gestión de Activos Informáticos",
        165,
        43,
        {
          align: "center",
        }
      );

      // Agrega la fecha, hora y total.

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(10);

      doc.setTextColor(
        138,
        32,
        54
      );

      doc.text(
        "FECHA:",
        168,
        52
      );

      doc.text(
        "HORA:",
        215,
        52
      );

      doc.text(
        "TOTAL:",
        258,
        52
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(70);

      doc.text(
        fecha.toLocaleDateString("es-MX"),
        184,
        52
      );

      doc.text(
        fecha.toLocaleTimeString("es-MX"),
        228,
        52
      );

      /*
       * Muestra únicamente el número de registros
       * que realmente fueron exportados.
       */

      doc.text(
        `${impresorasExportables.length}`,
        287,
        52,
        {
          align: "right",
        }
      );
    },
  });

  // Agrega el pie de página.

  const paginas = doc.getNumberOfPages();

  for (
    let pagina = 1;
    pagina <= paginas;
    pagina++
  ) {
    doc.setPage(pagina);

    doc.setDrawColor(220);
    doc.setLineWidth(0.3);

    // Dibuja la línea separadora.

    doc.line(
      10,
      196,
      287,
      196
    );

    // Configura el texto del pie de página.

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(9);
    doc.setTextColor(90);

    doc.text(
      "Documento generado automáticamente por el Sistema Control Equipos de Cómputo | Departamento de Informática",
      10,
      201
    );

    // Muestra la numeración de páginas.

    doc.text(
      `Página ${pagina} de ${paginas}`,
      287,
      201,
      {
        align: "right",
      }
    );
  }

  // Genera el nombre del archivo.

  const nombreArchivo =
    `Control_Equipos_${fecha
      .toLocaleDateString("es-MX")
      .replace(/\//g, "-")}.pdf`;

  // Descarga el archivo PDF.

  doc.save(nombreArchivo);
}