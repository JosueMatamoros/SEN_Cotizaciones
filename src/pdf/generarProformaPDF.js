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
  const azulSuave = [184, 230, 245];
  const texto = [26, 95, 122];
  const textoOscuro = [15, 50, 70];
  const blanco = [255, 255, 255];

  const headerImg = await toDataUrl("/assets/header-sen.png");
  const footerImg = await toDataUrl("/assets/footer-sen.png");

  const headerH = 175;
  const footerH = 90;

  const marginX = 40;
  const gap = 20;

  const yCards = headerH + 18;
  const cardW = (pageW - marginX * 2 - gap) / 2;
  const cardH = 180;

  const yTable = yCards + cardH + 28;

  const empresa = {
    nombre: "Soluciones Eléctricas del Norte",
    numero: "89893335",
    correo: "solusionesElectricas@gmail.com",
    web: "solusioneselectricas.com",
  };

  const items = [...(productos || []), ...(servicios || [])]
    .filter((i) => i && (i.nombre || i.precioUnitario || i.cantidad))
    .map((i) => {
      const cantidad = toNum(i.cantidad || 0);
      const precio = toNum(i.precioUnitario || 0);
      const total = cantidad * precio;
      return { nombre: safe(i.nombre), cantidad, precio, total };
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
    const gap = 178;

    const xRight = pageW - 40;
    const xLeft = xRight - gap;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...textoOscuro);

    doc.text(fitText(doc, f, 160), xLeft, y, { align: "right" });
    doc.text(fitText(doc, p, 140), xRight, y, { align: "right" });
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

  const drawCard = (x, y, title, main, lines, iconPath) => {
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(x + 4, y + 4, cardW, cardH, 12, 12, "F");

    doc.setFillColor(...blanco);
    doc.roundedRect(x, y, cardW, cardH, 12, 12, "F");

    doc.setDrawColor(...azulPrimario);
    doc.setLineWidth(2.5);
    doc.roundedRect(x, y, cardW, cardH, 12, 12, "S");

    doc.setFillColor(...azulOscuro);
    doc.roundedRect(x, y, cardW, 52, 12, 12, "F");
    doc.setFillColor(...azulPrimario);
    doc.rect(x, y + 40, cardW, 12, "F");

    doc.setFillColor(...azulSuave);
    doc.rect(x, y + 52, cardW, 4, "F");

    let titleX = x + 20;
    if (iconPath) {
      try {
        doc.addImage(iconPath, "PNG", x + 18, y + 18, 24, 24);
        titleX = x + 50;
      } catch (e) {}
    }

    doc.setTextColor(...blanco);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, titleX, y + 34);

    doc.setTextColor(...textoOscuro);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(fitText(doc, main, cardW - 40), x + 20, y + 88);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...texto);

    let yy = y + 112;
    for (const l of lines.filter(Boolean)) {
      doc.setFillColor(...azulPrimario);
      doc.circle(x + 20, yy - 4, 2, "F");
      doc.text(fitText(doc, l, cardW - 50), x + 30, yy);
      yy += 20;
    }
  };

  const drawCards = async () => {
    let empresaIcon = null;
    let clienteIcon = null;

    try {
      empresaIcon = await toDataUrl("/assets/icon-empresa.png");
    } catch (e) {}

    try {
      clienteIcon = await toDataUrl("/assets/icon-cliente.png");
    } catch (e) {}

    drawCard(
      marginX,
      yCards,
      "EMPRESA",
      empresa.nombre,
      [
        `Telefono: ${empresa.numero}`,
        `Correo: ${empresa.correo}`,
        `Web: ${empresa.web}`,
      ],
      empresaIcon,
    );

    drawCard(
      marginX + cardW + gap,
      yCards,
      "CLIENTE",
      safe(cliente?.nombre),
      [
        safe(cliente?.correo) ? `Correo: ${safe(cliente.correo)}` : "",
        safe(cliente?.numero) ? `Telefono: ${safe(cliente.numero)}` : "",
        safe(cliente?.direccion) ? `Direccion: ${safe(cliente.direccion)}` : "",
      ],
      clienteIcon,
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

    doc.setFillColor(235, 235, 235);
    doc.roundedRect(marginX + 3, startY + 3, leftW, 168, 12, 12, "F");

    doc.setFillColor(...blanco);
    doc.roundedRect(marginX, startY, leftW, 168, 12, 12, "F");

    doc.setDrawColor(...azulPrimario);
    doc.setLineWidth(2.5);
    doc.roundedRect(marginX, startY, leftW, 168, 12, 12, "S");

    doc.setFillColor(...azulSuave);
    doc.roundedRect(marginX, startY, leftW, 44, 12, 12, "F");
    doc.rect(marginX, startY + 32, leftW, 12, "F");

    doc.setTextColor(...azulOscuro);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("NOTAS", marginX + 20, startY + 30);

    doc.setTextColor(...texto);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    const nt =
      safe(nota).trim() ||
      "El pago vence al recibir esta proforma. Por favor realice el pago a los datos bancarios proporcionados o contáctenos si tiene alguna pregunta o necesita más información.";
    doc.text(doc.splitTextToSize(nt, leftW - 40), marginX + 20, startY + 64);

    const drawTotalRow = (y, label, value, isFinal) => {
      if (isFinal) {
        doc.setFillColor(220, 220, 220);
        doc.roundedRect(rightX + 3, y + 3, rowW, 52, 10, 10, "F");

        doc.setFillColor(...azulOscuro);
        doc.roundedRect(rightX, y, rowW, 52, 10, 10, "F");

        doc.setFillColor(...azulPrimario);
        doc.roundedRect(rightX, y, rowW, 8, 10, 10, "F");

        doc.setTextColor(...blanco);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(label, rightX + 20, y + 34);
        doc.text(value, rightX + rowW - 20, y + 34, { align: "right" });
        return;
      }

      doc.setFillColor(240, 240, 240);
      doc.roundedRect(rightX + 2, y + 2, rowW, 50, 10, 10, "F");

      doc.setFillColor(...blanco);
      doc.roundedRect(rightX, y, rowW, 50, 10, 10, "F");

      doc.setDrawColor(...azulSuave);
      doc.setLineWidth(2);
      doc.roundedRect(rightX, y, rowW, 50, 10, 10, "S");

      doc.setFillColor(...azulPrimario);
      doc.rect(rightX, y + 12, 5, 26, "F");

      doc.setTextColor(...textoOscuro);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(label, rightX + 20, y + 32);
      doc.text(value, rightX + rowW - 20, y + 32, { align: "right" });
    };

    drawTotalRow(startY + 6, "SUBTOTAL:", fmtCRC(subtotal), false);
    drawTotalRow(startY + 62, "IVA (13%):", fmtCRC(iva), false);
    drawTotalRow(startY + 118, "TOTAL:", fmtCRC(total), true);
  };

  drawHeader();
  drawHeaderFechaHora();
  await drawCards();

  autoTable(doc, {
    startY: yTable,
    margin: { left: marginX, right: marginX },
    head: [["DESCRIPCIÓN", "PRECIO", "CANT.", "TOTAL"]],
    body: rows.length ? rows : [["", "", "", ""]],
    styles: {
      font: "helvetica",
      fontSize: 10.5,
      cellPadding: 12,
      lineColor: [208, 232, 242],
      lineWidth: 1,
      overflow: "hidden",
    },
    headStyles: {
      fillColor: azulOscuro,
      textColor: blanco,
      fontStyle: "bold",
      fontSize: 11,
      halign: "left",
    },
    alternateRowStyles: { fillColor: azulClaro },
    bodyStyles: { textColor: texto },
    columnStyles: {
      0: {
        cellWidth: 240,
        fontStyle: "bold",
        textColor: textoOscuro,
        overflow: "linebreak",
        fontSize: 11,
      },
      1: { halign: "right", cellWidth: 110, overflow: "ellipsize" },
      2: { halign: "center", cellWidth: 60, overflow: "hidden" },
      3: {
        halign: "right",
        cellWidth: 115,
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

  const bottomLimit = pageH - footerH - 30;
  const lastY = doc.lastAutoTable.finalY;
  const need = 210;

  if (bottomLimit - lastY < need) {
    doc.addPage();
    drawHeader();
    drawHeaderFechaHora();
  }

  const yNotesTotals = Math.min(
    pageH - footerH - 250,
    doc.lastAutoTable ? doc.lastAutoTable.finalY + 24 : yTable + 24,
  );
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
