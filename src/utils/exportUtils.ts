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
    
    // Define margins in mm
    const MARGIN_TOP_MM = 15;
    const MARGIN_BOTTOM_MM = 15;
    const MARGIN_LEFT_MM = 15;
    const MARGIN_RIGHT_MM = 15;
    
    // Calculate printable area
    const PRINTABLE_WIDTH_MM = A4_WIDTH_MM - MARGIN_LEFT_MM - MARGIN_RIGHT_MM;
    const PRINTABLE_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_TOP_MM - MARGIN_BOTTOM_MM;
    const PRINTABLE_WIDTH_PX = A4_WIDTH_PX - (MARGIN_LEFT_MM * A4_WIDTH_PX / A4_WIDTH_MM) - (MARGIN_RIGHT_MM * A4_WIDTH_PX / A4_WIDTH_MM);

    // Temporarily set element width for consistent rendering
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;
    const originalMinHeight = element.style.minHeight;
    const originalPadding = element.style.padding;
    
    // Set consistent dimensions
    element.style.width = `${PRINTABLE_WIDTH_PX}px`;
    element.style.maxWidth = `${PRINTABLE_WIDTH_PX}px`;
    element.style.minHeight = 'auto';
    element.style.padding = '20px'; // Internal padding
    element.style.boxSizing = 'border-box';

    // Wait for layout reflow and fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Capture the element with proper settings
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: PRINTABLE_WIDTH_PX,
      height: element.scrollHeight,
      windowWidth: PRINTABLE_WIDTH_PX,
      windowHeight: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      logging: false,
      removeContainer: true,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Ensure proper styling in cloned document
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.width = `${PRINTABLE_WIDTH_PX}px`;
          clonedElement.style.maxWidth = `${PRINTABLE_WIDTH_PX}px`;
          clonedElement.style.minHeight = 'auto';
          clonedElement.style.padding = '20px';
          clonedElement.style.boxSizing = 'border-box';
          clonedElement.style.transform = 'scale(1)';
          clonedElement.style.transformOrigin = 'top left';
          
          // Ensure all icons and images are properly sized
          const icons = clonedElement.querySelectorAll('svg, img');
          icons.forEach((icon: any) => {
            if (icon.style.width && icon.style.height) {
              // Preserve existing dimensions
            } else {
              // Set default icon size if not specified
              icon.style.width = '16px';
              icon.style.height = '16px';
            }
          });
        }
      }
    });

    // Restore original styles
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;
    element.style.minHeight = originalMinHeight;
    element.style.padding = originalPadding;

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Calculate scaling for the printable area
    const imgWidth = PRINTABLE_WIDTH_MM;
    const imgHeight = (canvas.height * PRINTABLE_WIDTH_MM) / canvas.width;
    
    // Calculate how many pages we need
    const pageHeight = PRINTABLE_HEIGHT_MM;
    const totalPages = Math.ceil(imgHeight / pageHeight);
    
    console.log(`PDF Export: Creating ${totalPages} pages`);
    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
    console.log(`Image dimensions in PDF: ${imgWidth}mm x ${imgHeight}mm`);
    console.log(`Page dimensions: ${PRINTABLE_WIDTH_MM}mm x ${pageHeight}mm`);

    // Generate each page
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      // Calculate the Y position for this page slice
      const yOffset = -(pageIndex * pageHeight);
      
      // Add the image slice for this page with proper margins
      pdf.addImage(
        imgData, 
        'PNG', 
        MARGIN_LEFT_MM, // X position with left margin
        MARGIN_TOP_MM + yOffset, // Y position with top margin and offset
        imgWidth, 
        imgHeight, 
        undefined, 
        'FAST'
      );

      // Add page number in footer
      const pageNumberText = `Page ${pageIndex + 1} of ${totalPages}`;
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128); // Gray color
      
      // Calculate footer position
      const footerY = A4_HEIGHT_MM - 8; // 8mm from bottom
      const textWidth = pdf.getTextWidth(pageNumberText);
      const footerX = (A4_WIDTH_MM - textWidth) / 2; // Centered
      
      pdf.text(pageNumberText, footerX, footerY);
      
      // Reset text color for next page
      pdf.setTextColor(0, 0, 0);
    }

    // Add metadata
    pdf.setProperties({
      title: filename.replace('.pdf', ''),
      subject: 'Professional Resume',
      author: 'LinkedIn Resume Generator',
      creator: 'LinkedIn Resume Generator',
      producer: 'jsPDF'
    });

    // Save the PDF
    pdf.save(filename);
    
    console.log(`PDF exported successfully: ${filename}`);
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