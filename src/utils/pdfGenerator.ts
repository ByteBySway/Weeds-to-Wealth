import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { LanguageCode } from '../types';
import { TRANSLATIONS, Translations } from '../data/translations';

export interface DossierPdfData {
  acres: number;
  spend: number;
  partheniumKg: string;
  cowUrineLiters: string;
  jaggeryKg: string;
  seasonalSavings: number;
  co2Prevented: string;
  ureaBags: number;
  foliarSprayLiters: string;
  reportDate?: string;
  language?: LanguageCode;
  elementToCapture?: HTMLElement | null;
}

/**
 * Universal PDF export for NCSC Dossier.
 * 
 * Strategy:
 * 1. If elementToCapture (or document.getElementById('ncsc-printable-dossier-content')) is present,
 *    we use html2canvas + jsPDF to take an ultra-crisp snapshot of the rendered DOM.
 *    This completely solves the Odia / Devanagari font glyph limitation in default jsPDF,
 *    guaranteeing 100% accurate Indic script and font rendering.
 * 2. If no DOM element is available, it gracefully renders using the translated string dictionary
 *    directly with vector jsPDF.
 */
export async function exportDossierPdf(data: DossierPdfData): Promise<boolean> {
  const currentLang: LanguageCode = data.language || 'EN';
  const t: Translations = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  // Try high-fidelity canvas capture first (ideal for Odia & Hindi complex scripts)
  const targetElement = data.elementToCapture || document.getElementById('ncsc-printable-dossier-content');
  if (targetElement) {
    try {
      const canvas = await html2canvas(targetElement, {
        scale: 2.2, // Retina scale for razor-sharp typography
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 16; // 8mm margin on left and right
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pageHeight - 16) {
        doc.addImage(imgData, 'JPEG', 8, 8, imgWidth, imgHeight);
      } else {
        // Multi-page handling for large dossier prints
        let heightLeft = imgHeight;
        let position = 8;

        doc.addImage(imgData, 'JPEG', 8, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'JPEG', 8, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      const filename = `NCSC_2026_Weeds_to_Wealth_Dossier_${currentLang}_${data.acres}Acres.pdf`;
      doc.save(filename);
      return true;
    } catch (canvasErr) {
      console.warn('html2canvas capture failed; falling back to direct vector jsPDF generator:', canvasErr);
    }
  }

  // Fallback: Direct vector jsPDF engine localized using current dictionary
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2; // 182mm
    let y = 14;

    const setFont = (style: 'normal' | 'bold' = 'normal', size = 10, color: [number, number, number] = [24, 24, 27]) => {
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
    };

    // Header Top Bar
    doc.setFillColor(6, 95, 70); // Emerald 800
    doc.rect(margin, y, contentWidth, 3, 'F');
    y += 7;

    // Institution & Sub-theme title
    setFont('bold', 9, [6, 95, 70]);
    doc.text(t.pdfTitle, pageWidth / 2, y, { align: 'center' });
    y += 4.5;

    setFont('bold', 8, [82, 82, 91]);
    doc.text(t.pdfSubtheme, pageWidth / 2, y, { align: 'center' });
    y += 6;

    // Main Dossier Title
    setFont('bold', 13, [9, 9, 11]);
    doc.text(t.pdfDossierHeader, pageWidth / 2, y, { align: 'center' });
    y += 5;

    setFont('normal', 7.5, [113, 113, 122]);
    doc.text(t.pdfDossierDesc, pageWidth / 2, y, { align: 'center' });
    y += 5;

    // Horizontal Divider
    doc.setDrawColor(24, 24, 27);
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin + contentWidth, y);
    y += 4;

    // Metadata Grid (4 Columns)
    const metaColWidth = contentWidth / 4;
    doc.setFillColor(244, 244, 245);
    doc.rect(margin, y, contentWidth, 12, 'F');
    doc.setDrawColor(212, 212, 216);
    doc.setLineWidth(0.2);
    doc.rect(margin, y, contentWidth, 12, 'S');

    const metaItems = [
      { label: 'PROJECT STATUS', val: t.pdfProjectStatus },
      { label: 'AGRO-ECOLOGICAL ZONE', val: t.pdfZone },
      { label: 'REPORT DATE', val: data.reportDate || new Date().toLocaleDateString('en-GB') },
      { label: 'IKS REFERENCE', val: t.pdfIksRef },
    ];

    metaItems.forEach((item, idx) => {
      const colX = margin + idx * metaColWidth + 2.5;
      setFont('bold', 6, [113, 113, 122]);
      doc.text(item.label, colX, y + 4.2);
      setFont('bold', 7, [24, 24, 27]);
      doc.text(item.val, colX, y + 8.8);
      if (idx > 0) {
        doc.line(margin + idx * metaColWidth, y, margin + idx * metaColWidth, y + 12);
      }
    });

    y += 16;

    // Section 1: Stoichiometry Table
    setFont('bold', 9, [24, 24, 27]);
    doc.setFillColor(244, 244, 245);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setDrawColor(212, 212, 216);
    doc.rect(margin, y, contentWidth, 6, 'S');
    doc.text(t.pdfSection1, margin + 3, y + 4.2);
    setFont('normal', 7.5, [113, 113, 122]);
    doc.text(`${t.landholdingLabel}: ${data.acres}`, margin + contentWidth - 3, y + 4.2, { align: 'right' });
    y += 6;

    // Table Header
    doc.setFillColor(228, 228, 231);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.rect(margin, y, contentWidth, 5.5, 'S');
    setFont('bold', 7.5, [39, 39, 42]);
    doc.text(t.pdfSubstrateCol, margin + 3, y + 3.8);
    doc.text(t.pdfRoleCol, margin + 50, y + 3.8);
    doc.text(t.pdfAllocCol, margin + contentWidth - 3, y + 3.8, { align: 'right' });
    y += 5.5;

    // Table Rows
    const tableRows = [
      {
        sub: 'Parthenium hysterophorus',
        role: t.partheniumHarvestQuota,
        alloc: `${data.partheniumKg} kg`,
      },
      {
        sub: 'Bos indicus Fresh Urine',
        role: t.bosIndicusUrine,
        alloc: `${data.cowUrineLiters} Liters`,
      },
      {
        sub: 'Unrefined Jaggery',
        role: t.unrefinedJaggery,
        alloc: `${data.jaggeryKg} kg`,
      },
      {
        sub: t.foliarSprayTitle,
        role: 'Diluted aqueous foliar application (3 cycles)',
        alloc: `${data.foliarSprayLiters} Liters`,
      },
    ];

    tableRows.forEach((row, rIdx) => {
      const isAlt = rIdx % 2 === 1;
      if (isAlt) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, y, contentWidth, 5.5, 'F');
      }
      doc.setDrawColor(228, 228, 231);
      doc.rect(margin, y, contentWidth, 5.5, 'S');

      setFont('bold', 7, [24, 24, 27]);
      doc.text(row.sub, margin + 3, y + 3.8);

      setFont('normal', 6.8, [82, 82, 91]);
      doc.text(row.role, margin + 50, y + 3.8);

      setFont('bold', 7, [6, 95, 70]);
      doc.text(row.alloc, margin + contentWidth - 3, y + 3.8, { align: 'right' });

      y += 5.5;
    });

    y += 4;

    // Section 2: Economics & Carbon Offsets
    setFont('bold', 9, [24, 24, 27]);
    doc.setFillColor(244, 244, 245);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setDrawColor(212, 212, 216);
    doc.rect(margin, y, contentWidth, 6, 'S');
    doc.text(t.pdfSection2, margin + 3, y + 4.2);
    y += 6;

    const cardWidth = (contentWidth - 4) / 3;
    const cards = [
      {
        title: t.seasonalSavingsTitle.toUpperCase(),
        val: `Rs. ${data.seasonalSavings.toLocaleString('en-IN')}`,
        sub: '100% NPK input displacement',
        color: [180, 83, 9] as [number, number, number],
      },
      {
        title: t.co2PreventedTitle.toUpperCase(),
        val: `${data.co2Prevented} kg CO2`,
        sub: 'Avoided chemical synthesis',
        color: [6, 95, 70] as [number, number, number],
      },
      {
        title: t.ureaBagsTitle.toUpperCase(),
        val: `${data.ureaBags} Bags (45kg)`,
        sub: 'Synthetic fertilizer displaced',
        color: [24, 24, 27] as [number, number, number],
      },
    ];

    cards.forEach((card, cIdx) => {
      const cardX = margin + cIdx * (cardWidth + 2);
      doc.setFillColor(250, 250, 250);
      doc.rect(cardX, y, cardWidth, 16, 'F');
      doc.setDrawColor(212, 212, 216);
      doc.rect(cardX, y, cardWidth, 16, 'S');

      setFont('bold', 6.2, [113, 113, 122]);
      doc.text(card.title, cardX + 3, y + 4.5);

      setFont('bold', 9.5, card.color);
      doc.text(card.val, cardX + 3, y + 9.5);

      setFont('normal', 6, [113, 113, 122]);
      doc.text(card.sub, cardX + 3, y + 13.5);
    });

    y += 20;

    // Section 3: 20-Day Fermentation Milestones
    setFont('bold', 9, [24, 24, 27]);
    doc.setFillColor(244, 244, 245);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setDrawColor(212, 212, 216);
    doc.rect(margin, y, contentWidth, 6, 'S');
    doc.text(t.pdfSection3, margin + 3, y + 4.2);
    y += 6;

    const milestones = [
      {
        phase: `Days 1-7: ${t.acidogenesisStage} (pH 6.8 -> 4.5)`,
        badge: 'CRITICAL HYDROLYSIS',
        desc: 'Daily clockwise stirring. Rapid lactic and acetic acid accumulation drops pH to 4.5, cleaving parthenin allergens.',
      },
      {
        phase: `Days 8-14: ${t.proteolysisStage} (pH 4.5 -> 5.8)`,
        badge: 'MINERAL CHELATION',
        desc: 'Bi-daily agitation. Enzymatic proteolysis releases vegetative amino acids and chelated micro-nutrients.',
      },
      {
        phase: `Days 15-20: ${t.maturationStage} (pH 5.8 -> 7.1)`,
        badge: 'READY FOR SPRAY',
        desc: 'Hermetic anaerobic curing. Volatile organic acids neutralize into bio-available NPK liquid fertilizer.',
      },
    ];

    milestones.forEach((m) => {
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, y, contentWidth, 11, 'F');
      doc.setDrawColor(228, 228, 231);
      doc.rect(margin, y, contentWidth, 11, 'S');

      setFont('bold', 7, [24, 24, 27]);
      doc.text(m.phase, margin + 3, y + 4.2);

      setFont('bold', 5.8, [6, 95, 70]);
      doc.text(m.badge, margin + contentWidth - 3, y + 4.2, { align: 'right' });

      setFont('normal', 6.2, [82, 82, 91]);
      doc.text(m.desc, margin + 3, y + 8.2, { maxWidth: contentWidth - 6 });

      y += 11.5;
    });

    y += 3;

    // Section 4: N-P-K-S Parity
    setFont('bold', 9, [24, 24, 27]);
    doc.setFillColor(244, 244, 245);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setDrawColor(212, 212, 216);
    doc.rect(margin, y, contentWidth, 6, 'S');
    doc.text(t.pdfSection4, margin + 3, y + 4.2);
    y += 6;

    // Table Header
    doc.setFillColor(228, 228, 231);
    doc.rect(margin, y, contentWidth, 5.2, 'F');
    doc.setDrawColor(212, 212, 216);
    doc.rect(margin, y, contentWidth, 5.2, 'S');

    setFont('bold', 6.8, [39, 39, 42]);
    doc.text(t.pdfNutrientCol, margin + 3, y + 3.6);
    doc.text(t.pdfKunapaCol, margin + 38, y + 3.6);
    doc.text(t.pdfSynthCol, margin + 76, y + 3.6);
    doc.text(t.pdfMechCol, margin + 115, y + 3.6);
    y += 5.2;

    const nutrientRows = [
      { elem: 'Nitrogen (N)', kunapa: '1.84% (3.68 kg)', synth: 'Urea 46% (3.68 kg)', note: 'Humic amino peptide slow release' },
      { elem: 'Phosphorus (P)', kunapa: '0.92% (1.84 kg)', synth: 'DAP 46% (1.84 kg)', note: 'Citrate-soluble organic phosphate' },
      { elem: 'Potassium (K)', kunapa: '1.45% (2.90 kg)', synth: 'MOP 60% (2.90 kg)', note: 'Parthenium leaf ash enriched, zero chloride' },
      { elem: 'Sulfur (S)', kunapa: '0.68% (1.36 kg)', synth: 'SSP Single Super Phos.', note: 'Bio-fungicidal systemic defense' },
    ];

    nutrientRows.forEach((nRow, nrIdx) => {
      const isAlt = nrIdx % 2 === 1;
      if (isAlt) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, y, contentWidth, 5.2, 'F');
      }
      doc.setDrawColor(228, 228, 231);
      doc.rect(margin, y, contentWidth, 5.2, 'S');

      setFont('bold', 6.5, [24, 24, 27]);
      doc.text(nRow.elem, margin + 3, y + 3.6);

      setFont('bold', 6.5, [6, 95, 70]);
      doc.text(nRow.kunapa, margin + 38, y + 3.6);

      setFont('normal', 6.5, [100, 100, 110]);
      doc.text(nRow.synth, margin + 76, y + 3.6);

      setFont('normal', 6, [71, 85, 105]);
      doc.text(nRow.note, margin + 115, y + 3.6, { maxWidth: contentWidth - 118 });

      y += 5.2;
    });

    y += 3.5;

    // Section 5: Biosecurity Verification Assurance Box
    const bioBoxHeight = 20;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, bioBoxHeight, 'F');
    doc.setDrawColor(6, 95, 70);
    doc.setLineWidth(0.35);
    doc.rect(margin, y, contentWidth, bioBoxHeight, 'S');

    setFont('bold', 7.5, [6, 95, 70]);
    doc.text(t.pdfSection5, margin + 3, y + 4.5);

    setFont('normal', 6.2, [39, 39, 42]);
    doc.text(t.pdfBiosecurityText, margin + 3, y + 8.5, { maxWidth: contentWidth - 6, lineHeightFactor: 1.25 });

    doc.setDrawColor(209, 231, 221);
    doc.setLineWidth(0.2);
    doc.line(margin + 3, y + 15, margin + contentWidth - 3, y + 15);

    setFont('bold', 5.6, [100, 116, 139]);
    doc.text(t.pdfDocRef, margin + 3, y + 18.5);
    y += bioBoxHeight + 4;

    // Signatures
    const sigY = y + 1;
    doc.setDrawColor(24, 24, 27);
    doc.setLineWidth(0.4);

    doc.line(margin + 5, sigY + 8, margin + 70, sigY + 8);
    setFont('bold', 7.5, [24, 24, 27]);
    doc.text(t.pdfSignInvestigator, margin + 5, sigY + 12);
    setFont('normal', 6.5, [113, 113, 122]);
    doc.text('KV Bhawanipatna Agritech Unit', margin + 5, sigY + 15.5);

    const rightSigX = margin + contentWidth - 70;
    doc.line(rightSigX, sigY + 8, margin + contentWidth - 5, sigY + 8);
    setFont('bold', 7.5, [24, 24, 27]);
    doc.text(t.pdfSignEvaluator, rightSigX, sigY + 12);
    setFont('normal', 6.5, [113, 113, 122]);
    doc.text('Sub-Theme 5 (IKS) Jury Panel', rightSigX, sigY + 15.5);

    // Footer
    setFont('normal', 6, [161, 161, 170]);
    doc.text('Generated by Weeds to Wealth | Mission LiFE Open-Science Platform', margin, pageHeight - 6);
    doc.text('Page 1 of 1', margin + contentWidth, pageHeight - 6, { align: 'right' });

    const filename = `NCSC_2026_Weeds_to_Wealth_Dossier_${currentLang}_${data.acres}Acres.pdf`;
    doc.save(filename);
    return true;
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    return false;
  }
}
