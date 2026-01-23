import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function safe(v) {
  return v == null ? "" : String(v);
}

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function fmtCRC(n) {
  const x = toNum(n);
  const fixed = x.toFixed(2);
  const parts = fixed.split(".");
  const int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (parts[1] === "00") return `₡${int}`;
  return `₡${int}.${parts[1]}`;
}

async function toDataUrl(url) {
  const r = await fetch(url);
  const b = await r.blob();
  const fr = new FileReader();
  return await new Promise((res, rej) => {
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(b);
  });
}

async function svgToPngDataUrl(url, size) {
  const r = await fetch(url);
  const svgText = await r.text();
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  return await new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(svgUrl);
      res(canvas.toDataURL("image/png"));
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(svgUrl);
      rej(e);
    };
    img.src = svgUrl;
  });
}

function fitText(doc, text, maxW) {
  const t = safe(text);
  if (!t) return "";
  if (doc.getTextWidth(t) <= maxW) return t;
  let s = t;
  while (s.length > 0 && doc.getTextWidth(`${s}...`) > maxW) {
    s = s.slice(0, -1);
  }
  return s.length ? `${s}...` : "";
}

function wrapTitleTwoLines(doc, text, maxW) {
  const t = safe(text).trim();
  if (!t) return [""];
  const lines = doc.splitTextToSize(t, maxW);
  if (lines.length <= 2) return lines;
  const first = safe(lines[0]);
  const rest = safe(lines.slice(1).join(" "));
  const second = fitText(doc, rest, maxW);
  return [first, second];
}

export async function generarProformaPDF({
  fechaTexto,
  horaTexto,
  numeroProforma,
  cliente,
  productos,
  servicios,
  aplicarIVA,
  nota,
  nombreArchivo,
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const azulPrimario = [79, 179, 217];
  const azulOscuro = [44, 95, 122];
  const azulClaro = [227, 244, 251];
  const texto = [26, 95, 122];
  const textoOscuro = [15, 50, 70];
  const blanco = [255, 255, 255];

  const headerImg = await toDataUrl("/assets/header-sen.png");
  const footerImg = await toDataUrl("/assets/footer-sen.png");

  const iconRaster = 96;
  const iconDraw = 12;

  const icons = {
    phone: await svgToPngDataUrl("/assets/icons/phone.svg", iconRaster),
    mail: await svgToPngDataUrl("/assets/icons/mail.svg", iconRaster),
    location: await svgToPngDataUrl("/assets/icons/location.svg", iconRaster),
    web: await svgToPngDataUrl("/assets/icons/web.svg", iconRaster),
  };


  const headerH = 175;
  const footerH = 90;

  const marginX = 40;
  const gap = 22;

  const yCards = headerH + 18;

  const cardW = (pageW - marginX * 2 - gap) / 2;
  const cardH = 120;

  const yTable = yCards + cardH + 18;

  const empresa = {
    nombre: "Soluciones Eléctricas del Norte",
    numero: "89893335",
    correo: "solusionesElectricas@gmail.com",
    web: "solusioneselectricas.com",
    direccion: "",
  };

  const clienteFinal =
    cliente &&
    (cliente.nombre || cliente.correo || cliente.numero || cliente.direccion)
      ? cliente
      : {
          nombre: "Cliente de Prueba",
          correo: "cliente.prueba@gmail.com",
          numero: "8888-8888",
          direccion: "San Jose, Costa Rica",
        };

  const productosFinal =
    Array.isArray(productos) && productos.length
      ? productos
      : [
          {
            nombre: "Interruptor termomagnetico 20A",
            cantidad: 2,
            precioUnitario: 3500,
          },
          {
            nombre: "Cable THHN #12 (metro)",
            cantidad: 35,
            precioUnitario: 650,
          },
          {
            nombre: "Toma doble polarizado",
            cantidad: 6,
            precioUnitario: 1200,
          },
        ];

  const serviciosFinal =
    Array.isArray(servicios) && servicios.length
      ? servicios
      : [
          {
            nombre: "Instalacion de tomas y cableado",
            cantidad: 1,
            precioUnitario: 25000,
          },
        ];

  const items = [...productosFinal, ...serviciosFinal]
    .filter((i) => i && (i.nombre || i.precioUnitario || i.cantidad))
    .map((i) => {
      const cantidad = toNum(i.cantidad || 0);
      const precio = toNum(i.precioUnitario || 0);
      const totalIt = cantidad * precio;
      return { nombre: safe(i.nombre), cantidad, precio, total: totalIt };
    });

  let subtotal = 0;
  for (const it of items) subtotal += it.total;

  const iva = aplicarIVA ? subtotal * 0.13 : 0;
  const total = subtotal + iva;

  const drawHeader = () => {
    doc.addImage(headerImg, "PNG", 0, 0, pageW, headerH);
  };

  const drawHeaderFechaHora = () => {
    const f = safe(fechaTexto).trim();
    const p = safe(numeroProforma).trim();

    const y = 140;
    const gapHeader = 178;

    const xRight = pageW - 40;
    const xLeft = xRight - gapHeader;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...textoOscuro);

    doc.text(fitText(doc, f, 180), xLeft, y, { align: "right" });
    doc.text(fitText(doc, p, 160), xRight, y, { align: "right" });
  };

  const drawFooter = (pageNum, pageCount) => {
    doc.addImage(footerImg, "PNG", 0, pageH - footerH, pageW, footerH);

    doc.setTextColor(180, 180, 180);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Pagina ${pageNum} de ${pageCount}`, pageW - 6, pageH - 6, {
      align: "right",
    });
  };

  const drawCompactCard = (x, y, title, lines) => {
    doc.setFillColor(230, 238, 245);
    doc.roundedRect(x + 3, y + 4, cardW, cardH, 14, 14, "F");

    doc.setFillColor(...blanco);
    doc.setDrawColor(220, 230, 240);
    doc.setLineWidth(1.2);
    doc.roundedRect(x, y, cardW, cardH, 14, 14, "FD");

    const textX = x + 18;
    const maxTextW = cardW - (textX - x) - 18;

    doc.setTextColor(...textoOscuro);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    const titleLines = wrapTitleTwoLines(doc, title, maxTextW);
    const titleY = y + 26;
    const lineGap = 14;

    doc.text(titleLines[0] || "", textX, titleY);
    if (titleLines[1]) doc.text(titleLines[1], textX, titleY + lineGap);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11.2);
    doc.setTextColor(...texto);

    const linesStartY = titleLines[1] ? y + 60 : y + 52;

    let yy = linesStartY;
    for (const row of lines.filter(Boolean)) {
      if (row.icon) {
        doc.addImage(row.icon, "PNG", textX, yy - 10, iconDraw, iconDraw);
      }
      doc.text(fitText(doc, row.text, maxTextW - 18), textX + 22, yy);
      yy += 19;
    }
  };

  const drawCards = () => {
    const empresaLines = [
      empresa.numero ? { icon: icons.phone, text: safe(empresa.numero) } : null,
      empresa.correo ? { icon: icons.mail, text: safe(empresa.correo) } : null,
      empresa.web ? { icon: icons.web, text: safe(empresa.web) } : null,
    ].filter(Boolean);

    const clienteLines = [
      clienteFinal?.correo
        ? { icon: icons.mail, text: safe(clienteFinal.correo) }
        : null,
      clienteFinal?.numero
        ? { icon: icons.phone, text: safe(clienteFinal.numero) }
        : null,
      clienteFinal?.direccion
        ? { icon: icons.location, text: safe(clienteFinal.direccion) }
        : null,
    ].filter(Boolean);

    drawCompactCard(marginX, yCards, empresa.nombre, empresaLines);
    drawCompactCard(
      marginX + cardW + gap,
      yCards,
      safe(clienteFinal?.nombre),
      clienteLines,
    );
  };

  const rows = items.map((it) => [
    it.nombre,
    fmtCRC(it.precio),
    String(it.cantidad),
    fmtCRC(it.total),
  ]);

  const drawNotesTotals = (startY) => {
    const leftW = (pageW - marginX * 2 - gap) / 2 + 30;
    const rightX = marginX + leftW + gap;
    const rowW = pageW - rightX - marginX;

    doc.setFillColor(...blanco);
    doc.setDrawColor(220, 230, 240);
    doc.setLineWidth(1.2);
    doc.roundedRect(marginX, startY, leftW, 148, 12, 12, "FD");

    doc.setFillColor(...azulClaro);
    doc.roundedRect(marginX, startY, leftW, 34, 12, 12, "F");

    doc.setTextColor(...azulOscuro);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("NOTAS", marginX + 16, startY + 24);

    doc.setTextColor(...textoOscuro);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);

    const nt =
      safe(nota).trim() ||
      "El pago vence al recibir esta proforma. Por favor realice el pago a los datos bancarios proporcionados o contáctenos si tiene alguna pregunta o necesita más información.";

    doc.text(doc.splitTextToSize(nt, leftW - 32), marginX + 16, startY + 52);

    const drawTotalRow = (y, label, value, isFinal) => {
      if (isFinal) {
        doc.setFillColor(...azulOscuro);
        doc.roundedRect(rightX, y, rowW, 46, 12, 12, "F");

        doc.setTextColor(...blanco);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(label, rightX + 16, y + 30);
        doc.text(value, rightX + rowW - 16, y + 30, { align: "right" });
        return;
      }

      doc.setFillColor(...blanco);
      doc.setDrawColor(220, 230, 240);
      doc.setLineWidth(1.2);
      doc.roundedRect(rightX, y, rowW, 42, 12, 12, "FD");

      doc.setFillColor(...azulPrimario);
      doc.rect(rightX, y + 10, 4, 22, "F");

      doc.setTextColor(...textoOscuro);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12.5);
      doc.text(label, rightX + 14, y + 27);
      doc.text(value, rightX + rowW - 14, y + 27, { align: "right" });
    };

    drawTotalRow(startY + 2, "SUBTOTAL:", fmtCRC(subtotal), false);
    drawTotalRow(startY + 50, "IVA (13%):", fmtCRC(iva), false);
    drawTotalRow(startY + 98, "TOTAL:", fmtCRC(total), true);
  };

  drawHeader();
  drawHeaderFechaHora();
  drawCards();

  autoTable(doc, {
    startY: yTable,
    margin: { left: marginX, right: marginX },
    head: [["DESCRIPCIÓN", "PRECIO", "CANT.", "TOTAL"]],
    body: rows.length ? rows : [["", "", "", ""]],
    styles: {
      font: "helvetica",
      fontSize: 10.5,
      cellPadding: 10,
      lineColor: [208, 232, 242],
      lineWidth: 1,
      overflow: "hidden",
      textColor: texto,
    },
    headStyles: {
      fillColor: azulOscuro,
      textColor: blanco,
      fontStyle: "bold",
      fontSize: 11,
      halign: "left",
    },
    alternateRowStyles: { fillColor: azulClaro },
    columnStyles: {
      0: {
        cellWidth: 260,
        fontStyle: "bold",
        textColor: textoOscuro,
        overflow: "linebreak",
        fontSize: 11,
      },
      1: { halign: "right", cellWidth: 100, overflow: "ellipsize" },
      2: { halign: "center", cellWidth: 70, overflow: "hidden" },
      3: {
        halign: "right",
        cellWidth: 105,
        overflow: "ellipsize",
        fontStyle: "bold",
        textColor: textoOscuro,
      },
    },
    didDrawPage: () => {
      drawHeader();
      drawHeaderFechaHora();
    },
  });

  const tableEndY = doc.lastAutoTable ? doc.lastAutoTable.finalY : yTable;
  const paddingAfterTable = 18;

  const blockH = 148;
  const bottomLimit = pageH - footerH - 30;

  let yNotesTotals = tableEndY + paddingAfterTable;

  if (yNotesTotals + blockH > bottomLimit) {
    doc.addPage();
    drawHeader();
    drawHeaderFechaHora();
    yNotesTotals = headerH + 24;
  }

  drawNotesTotals(yNotesTotals);

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawHeader();
    drawHeaderFechaHora();
    drawFooter(i, totalPages);
  }

  const name =
    safe(nombreArchivo).trim() ||
    `Proforma_${safe(numeroProforma).replace("#", "")}.pdf`;
  doc.save(name);
}
