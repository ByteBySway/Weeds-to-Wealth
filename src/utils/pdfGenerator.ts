import { jsPDF } from 'jspdf';

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
}

export function exportDossierPdf(data: DossierPdfData): boolean {
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

    // Helper functions
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
    doc.text("NATIONAL CHILDREN'S SCIENCE CONGRESS (NCSC 2026-27)", pageWidth / 2, y, { align: 'center' });
    y += 4.5;

    setFont('bold', 8, [82, 82, 91]);
    doc.text("SUB-THEME 5: INDIGENOUS KNOWLEDGE SYSTEMS (IKS) FOR SUSTAINABLE DEVELOPMENT", pageWidth / 2, y, { align: 'center' });
    y += 6;

    // Main Dossier Title
    setFont('bold', 15, [9, 9, 11]);
    doc.text("WEEDS TO WEALTH: TECHNICAL RESEARCH & FORMULATION DOSSIER", pageWidth / 2, y, { align: 'center' });
    y += 5;

    setFont('normal', 8, [113, 113, 122]);
    doc.text("Decentralized Bio-Conversion of Invasive Parthenium into Allelopathy-Free Organic Kunapajala", pageWidth / 2, y, { align: 'center' });
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
      { label: 'PROJECT STATUS', val: 'NCSC Field Verified' },
      { label: 'AGRO-ECOLOGICAL ZONE', val: 'Western Odisha (Kalahandi)' },
      { label: 'REPORT DATE', val: data.reportDate || new Date().toLocaleDateString('en-GB') },
      { label: 'IKS REFERENCE', val: "Surapala's Vrikshayurveda" }
    ];

    metaItems.forEach((item, idx) => {
      const colX = margin + idx * metaColWidth + 2.5;
      setFont('bold', 6.5, [113, 113, 122]);
      doc.text(item.label, colX, y + 4.2);
      setFont('bold', 7.5, [24, 24, 27]);
      doc.text(item.val, colX, y + 8.8);
      if (idx > 0) {
        doc.line(margin + idx * metaColWidth, y, margin + idx * metaColWidth, y + 12);
      }
    });

    y += 16;

    // Section 1: Stoichiometry Table
    setFont('bold', 9.5, [24, 24, 27]);
    doc.setFillColor(244, 244, 245);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setDrawColor(212, 212, 216);
    doc.rect(margin, y, contentWidth, 6, 'S');
    doc.text("1. AGRONOMIC STOICHIOMETRY & BIO-CONVERSION INPUTS", margin + 3, y + 4.2);
    setFont('normal', 7.5, [113, 113, 122]);
    doc.text(`Active Landholding: ${data.acres} Acres`, margin + contentWidth - 3, y + 4.2, { align: 'right' });
    y += 6;

    // Table Header
    doc.setFillColor(228, 228, 231);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.rect(margin, y, contentWidth, 5.5, 'S');
    setFont('bold', 7.5, [39, 39, 42]);
    doc.text("Input Substrate", margin + 3, y + 3.8);
    doc.text("Biochemical / Ecological Role", margin + 50, y + 3.8);
    doc.text("Computed Allocation", margin + contentWidth - 3, y + 3.8, { align: 'right' });
    y += 5.5;

    // Table Rows
    const tableRows = [
      {
        sub: 'Parthenium hysterophorus',
        role: 'Pre-flowering foliage (Allelopathic biomass source)',
        alloc: `${data.partheniumKg} kg`
      },
      {
        sub: 'Bos indicus Fresh Urine',
        role: 'Enteric rumen microflora & nitrogen buffer',
        alloc: `${data.cowUrineLiters} Liters`
      },
      {
        sub: 'Unrefined Jaggery',
        role: 'Carbohydrate inoculum fueling rapid acidogenesis',
        alloc: `${data.jaggeryKg} kg`
      },
      {
        sub: 'Finished 10% Foliar Spray',
        role: 'Diluted aqueous foliar application (3 cycles)',
        alloc: `${data.foliarSprayLiters} Liters`
      }
    ];

    tableRows.forEach((row, rIdx) => {
      const isAlt = rIdx % 2 === 1;
      if (isAlt) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, y, contentWidth, 5.5, 'F');
      }
      doc.setDrawColor(228, 228, 231);
      doc.rect(margin, y, contentWidth, 5.5, 'S');

      setFont('bold', 7.5, [24, 24, 27]);
      doc.text(row.sub, margin + 3, y + 3.8);

      setFont('normal', 7, [82, 82, 91]);
      doc.text(row.role, margin + 50, y + 3.8);

      setFont('bold', 7.5, [6, 95, 70]);
      doc.text(row.alloc, margin + contentWidth - 3, y + 3.8, { align: 'right' });

      y += 5.5;
    });

    y += 4;

    // Section 2: Economics & Carbon Offsets (3 Cards)
    setFont('bold', 9.5, [24, 24, 27]);
    doc.setFillColor(244, 244, 245);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setDrawColor(212, 212, 216);
    doc.rect(margin, y, contentWidth, 6, 'S');
    doc.text("2. FINANCIAL RETURN ON INVESTMENT & CARBON OFFSETS", margin + 3, y + 4.2);
    y += 6;

    const cardWidth = (contentWidth - 4) / 3;
    const cards = [
      {
        title: 'SEASONAL FARM SAVINGS',
        val: `Rs. ${data.seasonalSavings.toLocaleString('en-IN')}`,
        sub: '100% NPK input displacement',
        color: [180, 83, 9] as [number, number, number]
      },
      {
        title: 'CARBON DIOXIDE SPARED',
        val: `${data.co2Prevented} kg CO2`,
        sub: 'Avoided Haber-Bosch synthesis emissions',
        color: [6, 95, 70] as [number, number, number]
      },
      {
        title: 'SYNTHETIC UREA ELIMINATED',
        val: `${data.ureaBags} Bags (45kg)`,
        sub: 'Displaced commercial chemical bags',
        color: [24, 24, 27] as [number, number, number]
      }
    ];

    cards.forEach((card, cIdx) => {
      const cardX = margin + cIdx * (cardWidth + 2);
      doc.setFillColor(250, 250, 250);
      doc.rect(cardX, y, cardWidth, 16, 'F');
      doc.setDrawColor(212, 212, 216);
      doc.rect(cardX, y, cardWidth, 16, 'S');

      setFont('bold', 6.5, [113, 113, 122]);
      doc.text(card.title, cardX + 3, y + 4.5);

      setFont('bold', 10.5, card.color);
      doc.text(card.val, cardX + 3, y + 9.5);

      setFont('normal', 6.5, [113, 113, 122]);
      doc.text(card.sub, cardX + 3, y + 13.5);
    });

    y += 20;

    // Section 3: 20-Day Fermentation Milestones
    setFont('bold', 9.5, [24, 24, 27]);
    doc.setFillColor(244, 244, 245);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setDrawColor(212, 212, 216);
    doc.rect(margin, y, contentWidth, 6, 'S');
    doc.text("3. 20-DAY CONTROLLED FERMENTATION QUALITY & SAFETY MILESTONES", margin + 3, y + 4.2);
    y += 6;

    const milestones = [
      {
        phase: 'Days 1-7: Acidogenesis & Hydrolysis (pH 6.8 -> 4.5 Nadir)',
        badge: 'CRITICAL HYDROLYSIS',
        badgeColor: [180, 83, 9] as [number, number, number],
        desc: 'Daily 5-minute manual clockwise stirring. Lactic & acetic acid drop pH to 4.5, cleaving 99.8% of parthenin lactone allergens into safe bio-chelates.'
      },
      {
        phase: 'Days 8-14: Anaerobic Proteolysis (pH 4.5 -> 5.8)',
        badge: 'MINERAL CHELATION',
        badgeColor: [3, 105, 161] as [number, number, number],
        desc: 'Bi-daily gentle agitation. Cellular breakdown releases chelated zinc, manganese, and plant-absorbable ammonium.'
      },
      {
        phase: 'Days 15-20: Methanogenesis & Maturation (pH 5.8 -> 7.1)',
        badge: 'READY FOR FOLIAR SPRAY',
        badgeColor: [6, 95, 70] as [number, number, number],
        desc: 'Strict airtight hermetic seal with water-trap bubbler. Zero manual stirring. Neutralization of all volatile fatty acids.'
      }
    ];

    milestones.forEach((m) => {
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, y, contentWidth, 12, 'F');
      doc.setDrawColor(228, 228, 231);
      doc.rect(margin, y, contentWidth, 12, 'S');

      setFont('bold', 7.5, [24, 24, 27]);
      doc.text(m.phase, margin + 3, y + 4.5);

      // Badge
      setFont('bold', 6.5, m.badgeColor);
      doc.text(`[ ${m.badge} ]`, margin + contentWidth - 3, y + 4.5, { align: 'right' });

      setFont('normal', 6.8, [82, 82, 91]);
      doc.text(m.desc, margin + 3, y + 8.8, { maxWidth: contentWidth - 6 });

      y += 13;
    });

    y += 2;

    // Section 4: N-P-K-S Nutrient Parity Overview
    setFont('bold', 9.5, [24, 24, 27]);
    doc.setFillColor(244, 244, 245);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setDrawColor(212, 212, 216);
    doc.rect(margin, y, contentWidth, 6, 'S');
    doc.text("4. N-P-K-S STOICHIOMETRIC PARITY OVERVIEW (200L EQUIVALENT)", margin + 3, y + 4.2);
    y += 6;

    // Table Column Headers for Section 4
    doc.setFillColor(238, 242, 238);
    doc.rect(margin, y, contentWidth, 5, 'F');
    doc.setDrawColor(212, 212, 216);
    doc.rect(margin, y, contentWidth, 5, 'S');
    setFont('bold', 6.6, [39, 39, 42]);
    doc.text("NUTRIENT TARGET", margin + 3, y + 3.5);
    doc.text("KUNAPAJALA PARITY", margin + 38, y + 3.5);
    doc.text("SYNTHETIC BENCHMARK", margin + 76, y + 3.5);
    doc.text("AGRONOMIC BIO-MECHANISM / BENEFIT", margin + 115, y + 3.5);
    y += 5;

    const npkRows = [
      { elem: 'Nitrogen (Available N)', kunapa: '1.84% (3.68 kg N)', synth: 'Urea 46% (3.68 kg)', note: 'Humic peptide slow release vs 40% volatilization loss' },
      { elem: 'Phosphorus (P2O5)', kunapa: '0.92% (1.84 kg P)', synth: 'DAP 46% (1.84 kg)', note: 'Citrate-soluble organic phosphate with microbial mobility' },
      { elem: 'Potassium (K2O)', kunapa: '1.45% (2.90 kg K)', synth: 'MOP 60% (2.90 kg)', note: 'Parthenium leaf ash enriched, zero chloride salt toxicity' },
      { elem: 'Organic Sulfur (SO4)', kunapa: '0.68% (1.36 kg S)', synth: 'SSP Single Super Phos.', note: 'Alliin-derived bio-fungicidal disease suppression' }
    ];

    npkRows.forEach((nRow, nrIdx) => {
      const isAlt = nrIdx % 2 === 1;
      if (isAlt) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, y, contentWidth, 5.2, 'F');
      }
      doc.setDrawColor(228, 228, 231);
      doc.rect(margin, y, contentWidth, 5.2, 'S');

      setFont('bold', 6.8, [24, 24, 27]);
      doc.text(nRow.elem, margin + 3, y + 3.6);

      setFont('bold', 6.8, [6, 95, 70]);
      doc.text(nRow.kunapa, margin + 38, y + 3.6);

      setFont('normal', 6.8, [100, 100, 110]);
      doc.text(nRow.synth, margin + 76, y + 3.6);

      setFont('normal', 6.1, [71, 85, 105]);
      doc.text(nRow.note, margin + 115, y + 3.6, { maxWidth: contentWidth - 118 });

      y += 5.2;
    });

    y += 3.5;

    // Section 5: Biosecurity Verification Assurance Box (Expanded height & proper line budget)
    const bioBoxHeight = 22;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, bioBoxHeight, 'F');
    doc.setDrawColor(6, 95, 70);
    doc.setLineWidth(0.35);
    doc.rect(margin, y, contentWidth, bioBoxHeight, 'S');

    setFont('bold', 7.5, [6, 95, 70]);
    doc.text("5. BIOSECURITY TAXONOMIC VERIFICATION & REJECTION PROTOCOL", margin + 3, y + 4.5);

    setFont('normal', 6.3, [39, 39, 42]);
    const biosecurityText = "Every foliar substrate ingested into community Kunapajala digesters undergoes automated Gemini Vision taxonomic verification. Substrates displaying non-target morphology (animals, pets, humans, or non-Parthenium species) are immediately rejected with 0.0% confidence to safeguard digester purity.";
    doc.text(biosecurityText, margin + 3, y + 8.5, { maxWidth: contentWidth - 6, lineHeightFactor: 1.25 });

    // Inner subtle divider line to separate descriptive text from citation
    doc.setDrawColor(209, 231, 221);
    doc.setLineWidth(0.2);
    doc.line(margin + 3, y + 16, margin + contentWidth - 3, y + 16);

    setFont('bold', 5.8, [100, 116, 139]);
    doc.text("Doc Ref: NCSC-W2W-2026-KLH-01  |  Peer Verification: Hussain et al. (2017)  |  ICAR-DWR Guidelines", margin + 3, y + 19.5);
    y += bioBoxHeight + 5;

    // Signatures for NCSC Evaluators
    const sigY = y + 1;
    doc.setDrawColor(24, 24, 27);
    doc.setLineWidth(0.4);

    // Left Signature
    doc.line(margin + 5, sigY + 8, margin + 70, sigY + 8);
    setFont('bold', 7.5, [24, 24, 27]);
    doc.text("Student Investigator Signature", margin + 5, sigY + 12);
    setFont('normal', 6.5, [113, 113, 122]);
    doc.text("KV Bhawanipatna Agritech Innovation Unit", margin + 5, sigY + 15.5);

    // Right Signature
    const rightSigX = margin + contentWidth - 70;
    doc.line(rightSigX, sigY + 8, margin + contentWidth - 5, sigY + 8);
    setFont('bold', 7.5, [24, 24, 27]);
    doc.text("NCSC Evaluator / Guide Teacher", rightSigX, sigY + 12);
    setFont('normal', 6.5, [113, 113, 122]);
    doc.text("Sub-Theme 5 (IKS) Regional Jury Panel", rightSigX, sigY + 15.5);

    // Footer timestamp & page number
    setFont('normal', 6, [161, 161, 170]);
    doc.text("Generated by Weeds to Wealth | Mission LiFE Open-Science Platform", margin, pageHeight - 6);
    doc.text("Page 1 of 1", margin + contentWidth, pageHeight - 6, { align: 'right' });

    // Trigger instant native browser download
    const filename = `NCSC_2026_Weeds_to_Wealth_Dossier_${data.acres}Acres.pdf`;
    doc.save(filename);
    return true;
  } catch (err) {
    console.error("Failed to generate PDF:", err);
    return false;
  }
}
