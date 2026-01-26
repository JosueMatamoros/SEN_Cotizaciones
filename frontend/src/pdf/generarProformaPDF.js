import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function safe(v) {
  return v == null ? "" : String(v);
}

function toNum(v) {
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function fmtMoney(n, currency) {
  const x = toNum(n);
  const fixed = x.toFixed(2);
  const parts = fixed.split(".");
  const int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const prefix = currency === "USD" ? "$" : "¢";
  if (parts[1] === "00") return `${prefix}${int}`;
  return `${prefix}${int}.${parts[1]}`;
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

async function loadFontAsBase64(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
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
  receptor,
  productos,
  servicios,
  moneda = "CRC",
  tipoCambio,
  aplicarIVA,
  nota,
  anexos,
  nombreArchivo,
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  let fontLoaded = false;
  try {
    const regularBase64 = await loadFontAsBase64("/assets/fonts/SourceSans3-Regular.ttf");
    const boldBase64 = await loadFontAsBase64("/assets/fonts/SourceSans3-Bold.ttf");

    doc.addFileToVFS("SourceSans3-Regular.ttf", regularBase64);
    doc.addFont("SourceSans3-Regular.ttf", "SourceSans3", "normal");

    doc.addFileToVFS("SourceSans3-Bold.ttf", boldBase64);
    doc.addFont("SourceSans3-Bold.ttf", "SourceSans3", "bold");

    doc.setFont("SourceSans3", "normal");
    fontLoaded = true;

  } catch (error) {
    console.error("Error cargando fuentes personalizadas:", error);
    doc.setFont("helvetica", "normal");
  }

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const azulOscuro = [44, 95, 122];
  const azulClaro = [227, 244, 251];
  const texto = [26, 95, 122];
  const textoOscuro = [15, 50, 70];
  const blanco = [255, 255, 255];

  const azulNota = [64, 155, 201];
  const azulTotal = [70, 160, 210];
  const azulTotalClaro = [220, 235, 245];

  const headerImg = await toDataUrl("/assets/header-sen.png");
  const footerImg = await toDataUrl("/assets/footer-sen.png");

  const iconRaster = 96;
  const iconDraw = 12;

  const icons = {
    phone: await svgToPngDataUrl("/assets/icons/phone.svg", iconRaster),
    mail: await svgToPngDataUrl("/assets/icons/mail.svg", iconRaster),
    location: await svgToPngDataUrl("/assets/icons/location.svg", iconRaster),
    web: await svgToPngDataUrl("/assets/icons/web.svg", iconRaster),
    asesor: await svgToPngDataUrl("/assets/icons/asesor.svg", iconRaster),
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
    numero: "6135-0349",
    correo: "soldelnorte.ceo@gmail.com",
    web: "solusioneselectricas.com",
    direccion: "",
  };

  const receptorFinal = receptor;

  const productosFinal = Array.isArray(productos) ? productos : [];
  const serviciosFinal = Array.isArray(servicios) ? servicios : [];

  // ✅ CONVERSIÓN DE MONEDA
  const tipoCambioFinal = toNum(tipoCambio) > 0 ? toNum(tipoCambio) : 520;
  const isUSD = moneda === "USD";

  const convertirMoneda = (montoCRC) => {
    return isUSD ? montoCRC / tipoCambioFinal : montoCRC;
  };

  const items = [...productosFinal, ...serviciosFinal]
    .filter((i) => i && safe(i.nombre).trim())
    .map((i) => {
      const cantidad = toNum(i.cantidad || 0);
      const precioCRC = toNum(i.precioUnitario || 0);
      const precio = convertirMoneda(precioCRC);
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
    const fecha = safe(fechaTexto).trim();
    const proforma = safe(numeroProforma).trim();

    const y = 142;
    const xLeft = 266;
    const xRight = pageW - 40;

    const azulClaroLabel = [90, 190, 225];
    const azulOscuroProforma = [44, 95, 122];
    const negro = [20, 20, 20];

    const label = "Fecha:";

    doc.setFont(fontLoaded ? "SourceSans3" : "helvetica", "normal");
    doc.setFontSize(12.5);

    doc.setTextColor(...azulClaroLabel);
    doc.text(label, xLeft, y);

    const wLabel = doc.getTextWidth(label);

    doc.setTextColor(...negro);
    const fechaFit = fitText(doc, fecha, 260);
    doc.text(` ${fechaFit}`, xLeft + wLabel, y);

    const leftBlock = `${label} ${fechaFit}`;

    doc.setFont(fontLoaded ? "SourceSans3" : "helvetica", "bold");
    doc.setTextColor(...azulOscuroProforma);

    const maxProformaW = xRight - xLeft - doc.getTextWidth(leftBlock);
    const proformaFit = fitText(doc, proforma, Math.max(120, maxProformaW));

    doc.text(proformaFit, xRight, y, { align: "right" });
  };

  const drawFooter = (pageNum, pageCount) => {
    doc.addImage(footerImg, "PNG", 0, pageH - footerH, pageW, footerH);

    doc.setTextColor(180, 180, 180);
    doc.setFont(fontLoaded ? "SourceSans3" : "helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Pagina ${pageNum} de ${pageCount}`, pageW - 6, pageH - 6, {
      align: "right",
    });
  };

  const drawCompactCard = (x, y, title, lines, asesorData) => {
    doc.setFillColor(230, 238, 245);
    doc.roundedRect(x + 3, y + 4, cardW, cardH, 14, 14, "F");

    doc.setFillColor(...blanco);
    doc.setDrawColor(220, 230, 240);
    doc.setLineWidth(1.2);
    doc.roundedRect(x, y, cardW, cardH, 14, 14, "FD");

    const textX = x + 18;
    const maxTextW = cardW - (textX - x) - 18;

    doc.setTextColor(...textoOscuro);
    doc.setFont(fontLoaded ? "SourceSans3" : "helvetica", "bold");
    doc.setFontSize(12);

    const titleLines = wrapTitleTwoLines(doc, title, maxTextW);
    const titleY = y + 26;
    const lineGap = 14;

    doc.text(titleLines[0] || "", textX, titleY);
    if (titleLines[1]) doc.text(titleLines[1], textX, titleY + lineGap);

    doc.setFont(fontLoaded ? "SourceSans3" : "helvetica", "normal");
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

    if (asesorData && (asesorData.nombre || asesorData.numero)) {
      const asesorY = yy;
      const iconSize = 14;
      const spacing = 8;

      doc.addImage(icons.asesor, "PNG", textX, asesorY - 11, iconSize, iconSize);

      let currentX = textX + iconSize + spacing;

      if (asesorData.nombre) {
        doc.setFontSize(11.2);
        const nombreWidth = doc.getTextWidth(asesorData.nombre);
        doc.text(asesorData.nombre, currentX, asesorY);
        currentX += nombreWidth + spacing + 4;
      }

      if (asesorData.numero) {
        doc.addImage(icons.phone, "PNG", currentX, asesorY - 11, iconSize, iconSize);
        currentX += iconSize + spacing;
        doc.setFontSize(11.2);
        doc.text(
          fitText(doc, asesorData.numero, maxTextW - (currentX - textX)),
          currentX,
          asesorY
        );
      }
    }
  };

  const drawCards = () => {
    const empresaLines = [
      empresa.numero ? { icon: icons.phone, text: safe(empresa.numero) } : null,
      empresa.correo ? { icon: icons.mail, text: safe(empresa.correo) } : null,
      empresa.web ? { icon: icons.web, text: safe(empresa.web) } : null,
    ].filter(Boolean);

    const receptorLines = [
      receptorFinal?.correo ? { icon: icons.mail, text: safe(receptorFinal.correo) } : null,
      receptorFinal?.numero ? { icon: icons.phone, text: safe(receptorFinal.numero) } : null,
      receptorFinal?.direccion ? { icon: icons.location, text: safe(receptorFinal.direccion) } : null,
    ].filter(Boolean);

    let asesorData = null;
    if (receptorFinal?.tipo === "empresa") {
      const asesorNombre = safe(receptorFinal.asesorNombre).trim();
      const asesorNumero = safe(receptorFinal.asesorNumero).trim();
      if (asesorNombre || asesorNumero) {
        asesorData = { nombre: asesorNombre || null, numero: asesorNumero || null };
      }
    }

    drawCompactCard(marginX, yCards, empresa.nombre, empresaLines);
    drawCompactCard(
      marginX + cardW + gap,
      yCards,
      safe(receptorFinal?.nombre),
      receptorLines,
      asesorData
    );
  };

  const rows = items.map((it) => [
    it.nombre,
    fmtMoney(it.precio, moneda),
    String(it.cantidad),
    fmtMoney(it.total, moneda),
  ]);

  const drawNotesTotals = (startY) => {
    const leftW = (pageW - marginX * 2 - gap) / 2 + 30;
    const rightX = marginX + leftW + gap;
    const rowW = pageW - rightX - marginX;

    const grisBorde = [210, 210, 210];
    const grisTexto = [90, 90, 90];
    const negroSuave = [30, 30, 30];

    const padL = 16;
    const padR = 16;

    const drawRightFitted = (text, xRight, y, maxW, baseSize, minSize) => {
      const t = safe(text);
      let size = baseSize;
      doc.setFontSize(size);
      while (size > minSize && doc.getTextWidth(t) > maxW) {
        size -= 0.5;
        doc.setFontSize(size);
      }
      doc.text(t, xRight, y, { align: "right" });
      doc.setFontSize(baseSize);
    };

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...grisBorde);
    doc.setLineWidth(1);
    doc.roundedRect(marginX, startY, leftW, 148, 10, 10, "FD");

    doc.setFillColor(...azulTotalClaro);
    doc.roundedRect(marginX, startY, leftW, 34, 10, 10, "F");

    doc.setTextColor(...azulNota);
    doc.setFont(fontLoaded ? "SourceSans3" : "helvetica", "bold");
    doc.setFontSize(14);
    doc.text("NOTAS", marginX + 16, startY + 23);

    doc.setTextColor(...grisTexto);
    doc.setFont(fontLoaded ? "SourceSans3" : "helvetica", "normal");
    doc.setFontSize(10.5);

    const nt = safe(nota).trim() || "...";

    doc.text(doc.splitTextToSize(nt, leftW - 32), marginX + 16, startY + 52);

    const drawTotalRow = (y, label, value, isFinal) => {
      if (isFinal) {
        doc.setFillColor(...azulTotal);
        doc.roundedRect(rightX, y, rowW, 44, 8, 8, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont(fontLoaded ? "SourceSans3" : "helvetica", "bold");
        doc.setFontSize(14);

        doc.text(label, rightX + padL, y + 28);

        const labelW = doc.getTextWidth(label);
        const maxWVal = rowW - padL - padR - labelW - 12;
        const xVal = rightX + rowW - padR;

        drawRightFitted(value, xVal, y + 28, maxWVal, 14, 10);
        return;
      }

      doc.setTextColor(...negroSuave);
      doc.setFont(fontLoaded ? "SourceSans3" : "helvetica", "bold");
      doc.setFontSize(12.5);

      doc.text(label, rightX + 6, y + 24);

      const labelW = doc.getTextWidth(label);
      const maxWVal = rowW - 6 - 6 - labelW - 10;
      const xVal = rightX + rowW - 6;

      drawRightFitted(value, xVal, y + 24, maxWVal, 12.5, 9);
    };

    drawTotalRow(startY + 6, "SUBTOTAL:", fmtMoney(subtotal, moneda), false);
    drawTotalRow(startY + 42, "IVA (13%):", fmtMoney(iva, moneda), false);
    drawTotalRow(startY + 78, "TOTAL:", fmtMoney(total, moneda), true);
  };

  const bottomLimit = pageH - footerH - 10;

  const drawAnexosDynamic = (anexosText, startY) => {
    const text = String(anexosText || "").trim();
    if (!text) return startY;

    const boxX = marginX;
    const boxW = pageW - marginX * 2;
    const contentX = boxX + 16;
    const contentW = boxW - 32;

    const titleYOffset = 20;
    const contentYStart = 45;
    const lineHeight = 12.8;
    const bottomPadding = 12;

    doc.setFont(fontLoaded ? "SourceSans3" : "helvetica", "normal");
    doc.setFontSize(10.5);
    const allLines = doc.splitTextToSize(text, contentW);

    const createNewPage = () => {
      doc.addPage();
      drawHeader();
      drawHeaderFechaHora();
      return headerH + 24;
    };

    let currentY = startY;
    let lineIndex = 0;

    while (lineIndex < allLines.length) {
      const minBoxHeight = contentYStart + (2 * lineHeight) + bottomPadding;

      if (currentY + minBoxHeight > bottomLimit) {
        currentY = createNewPage();
      }

      const availableHeight = bottomLimit - currentY;
      const contentAreaHeight = availableHeight - contentYStart - bottomPadding;
      const maxLinesInPage = Math.floor(contentAreaHeight / lineHeight);

      const linesToDraw = allLines.slice(lineIndex, lineIndex + maxLinesInPage);
      const actualContentHeight = linesToDraw.length * lineHeight;
      const boxHeight = contentYStart + actualContentHeight + bottomPadding;

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(210, 210, 210);
      doc.setLineWidth(1);
      doc.roundedRect(boxX, currentY, boxW, boxHeight, 10, 10, "FD");

      doc.setTextColor(64, 155, 201);
      doc.setFont(fontLoaded ? "SourceSans3" : "helvetica", "bold");
      doc.setFontSize(14);
      doc.text("ANEXOS", boxX + 16, currentY + titleYOffset);

      doc.setTextColor(90, 90, 90);
      doc.setFont(fontLoaded ? "SourceSans3" : "helvetica", "normal");
      doc.setFontSize(10.5);

      let textY = currentY + contentYStart;
      for (const line of linesToDraw) {
        doc.text(line, contentX, textY);
        textY += lineHeight;
      }

      lineIndex += linesToDraw.length;
      currentY = currentY + boxHeight + 18;

      if (lineIndex < allLines.length) {
        if (currentY + minBoxHeight > bottomLimit) {
          currentY = createNewPage();
        }
      }
    }

    return currentY;
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
      font: fontLoaded ? "SourceSans3" : "helvetica",
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

  let yNotesTotals = tableEndY + paddingAfterTable;

  if (yNotesTotals + blockH > bottomLimit) {
    doc.addPage();
    drawHeader();
    drawHeaderFechaHora();
    yNotesTotals = headerH + 24;
  }

  drawNotesTotals(yNotesTotals);

  if (anexos && String(anexos).trim()) {
    doc.addPage();
    drawHeader();
    drawHeaderFechaHora();
    let anexosY = headerH + 24;
    anexosY = drawAnexosDynamic(anexos, anexosY);
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawHeader();
    drawHeaderFechaHora();
    drawFooter(i, totalPages);
  }

  const name = "Proforma.pdf";
  doc.save(name);
}
