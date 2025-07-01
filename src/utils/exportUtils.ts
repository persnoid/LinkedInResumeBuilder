import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData } from '../types/resume';

export const exportToPDF = async (elementId: string, filename: string = 'resume.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Resume element not found');
  }

  try {
    // A4 dimensions in mm and pixels
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;
    const A4_WIDTH_PX = 794; // A4 width in pixels at 96 DPI
    const A4_HEIGHT_PX = 1123; // A4 height in pixels at 96 DPI

    // Temporarily set element width for consistent rendering
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;
    element.style.width = `${A4_WIDTH_PX}px`;
    element.style.maxWidth = `${A4_WIDTH_PX}px`;

    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Clone content for page-by-page rendering
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = `${A4_WIDTH_PX}px`;
    clone.style.maxWidth = `${A4_WIDTH_PX}px`;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-100000px';
    container.style.left = '0';
    container.style.width = `${A4_WIDTH_PX}px`;
    container.style.overflow = 'hidden';
    container.appendChild(clone);
    document.body.appendChild(container);

    // Wait for fonts and images to load in the clone
    await new Promise(resolve => setTimeout(resolve, 500));

    const PX_PER_MM = A4_HEIGHT_PX / A4_HEIGHT_MM;
    const MARGIN_TOP_MM = 10;
    const MARGIN_BOTTOM_MM = 10;
    const marginTopPx = Math.round(MARGIN_TOP_MM * PX_PER_MM);
    const marginBottomPx = Math.round(MARGIN_BOTTOM_MM * PX_PER_MM);
    const pageHeightPx = A4_HEIGHT_PX - marginTopPx - marginBottomPx;

    const breakPoints: number[] = [];
    clone.querySelectorAll<HTMLElement>('*').forEach(node => {
      const style = window.getComputedStyle(node);
      if (style.pageBreakBefore === 'always') {
        breakPoints.push(node.offsetTop);
      }
      if (style.pageBreakAfter === 'always') {
        breakPoints.push(node.offsetTop + node.offsetHeight);
      }
    });
    breakPoints.sort((a, b) => a - b);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const SCALE = 3;
    const totalHeight = clone.scrollHeight;
    let offset = 0;
    let pageIndex = 0;

    while (offset < totalHeight) {
      let captureHeight = pageHeightPx;
      for (const br of breakPoints) {
        if (br > offset && br < offset + captureHeight) {
          captureHeight = br - offset;
          break;
        }
      }

      const canvas = await html2canvas(clone, {
        scale: SCALE,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: A4_WIDTH_PX,
        height: captureHeight,
        windowWidth: A4_WIDTH_PX,
        windowHeight: captureHeight,
        scrollX: 0,
        scrollY: -offset,
        logging: false,
        removeContainer: true,
        imageTimeout: 15000
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgHeight = (canvas.height * A4_WIDTH_MM) / canvas.width;

      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, MARGIN_TOP_MM, A4_WIDTH_MM, imgHeight, undefined, 'FAST');

      offset += captureHeight;
      pageIndex++;
    }

    document.body.removeChild(container);

    // Restore original styles
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to export PDF. Please try again.');
  }
};

export const exportToWord = async (resumeData: ResumeData, filename: string = 'resume.docx') => {
  try {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: '210mm',
                height: '297mm'
              },
              margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
              }
            }
          },
          children: [
            // Header
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.personalInfo.name,
                  bold: true,
                  size: 32,
                  color: '2563EB'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.personalInfo.title,
                  size: 24,
                  color: '1E40AF'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // Contact Information
            new Paragraph({
              children: [
                new TextRun({
                  text: `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}`,
                  size: 20
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // Professional Summary
            new Paragraph({
              children: [
                new TextRun({
                  text: 'PROFESSIONAL SUMMARY',
                  bold: true,
                  size: 24,
                  color: '2563EB'
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.summary,
                  size: 22
                })
              ],
              spacing: { after: 400 }
            }),

            // Work Experience
            new Paragraph({
              children: [
                new TextRun({
                  text: 'WORK EXPERIENCE',
                  bold: true,
                  size: 24,
                  color: '2563EB'
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),

            // Experience entries
            ...resumeData.experience.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.position,
                    bold: true,
                    size: 22
                  }),
                  new TextRun({
                    text: ` | ${exp.company}`,
                    size: 22,
                    color: '1E40AF'
                  }),
                  new TextRun({
                    text: ` | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
                    size: 20,
                    italics: true
                  })
                ],
                spacing: { before: 200, after: 100 }
              }),
              ...exp.description.map(desc => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${desc}`,
                      size: 20
                    })
                  ],
                  spacing: { after: 100 }
                })
              )
            ]),

            // Education
            new Paragraph({
              children: [
                new TextRun({
                  text: 'EDUCATION',
                  bold: true,
                  size: 24,
                  color: '2563EB'
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),

            ...resumeData.education.map(edu => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: edu.degree,
                    bold: true,
                    size: 22
                  }),
                  new TextRun({
                    text: ` | ${edu.school}`,
                    size: 22,
                    color: '1E40AF'
                  }),
                  new TextRun({
                    text: ` | ${edu.startDate} - ${edu.endDate}`,
                    size: 20,
                    italics: true
                  })
                ],
                spacing: { after: 200 }
              })
            ),

            // Skills
            new Paragraph({
              children: [
                new TextRun({
                  text: 'SKILLS',
                  bold: true,
                  size: 24,
                  color: '2563EB'
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.skills.map(skill => 
                    `${skill.name}${skill.level ? ` (${skill.level})` : ''}`
                  ).join(' • '),
                  size: 20
                })
              ],
              spacing: { after: 400 }
            }),

            // Languages
            ...(resumeData.languages && resumeData.languages.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'LANGUAGES',
                    bold: true,
                    size: 24,
                    color: '2563EB'
                  })
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: resumeData.languages.map(lang => 
                      `${lang.name}${lang.level ? ` (${lang.level})` : ''}`
                    ).join(' • '),
                    size: 20
                  })
                ],
                spacing: { after: 400 }
              })
            ] : []),

            // Certifications
            ...(resumeData.certifications.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'CERTIFICATIONS',
                    bold: true,
                    size: 24,
                    color: '2563EB'
                  })
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 }
              }),
              ...resumeData.certifications.map(cert => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cert.name,
                      bold: true,
                      size: 22
                    }),
                    new TextRun({
                      text: ` | ${cert.issuer} | ${cert.date}`,
                      size: 20
                    })
                  ],
                  spacing: { after: 200 }
                })
              )
            ] : [])
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw new Error('Failed to export Word document. Please try again.');
  }
};