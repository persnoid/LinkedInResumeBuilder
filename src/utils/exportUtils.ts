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
    const MARGIN_MM = 5; // 20mm margins on all sides
    
    // Calculate printable area in mm
    const PRINTABLE_WIDTH_MM = A4_WIDTH_MM - (2 * MARGIN_MM);
    const PRINTABLE_HEIGHT_MM = A4_HEIGHT_MM - (5 * MARGIN_MM);
    
    // Convert to pixels
    const PRINTABLE_WIDTH_PX = (PRINTABLE_WIDTH_MM / A4_WIDTH_MM) * A4_WIDTH_PX;
    const PRINTABLE_HEIGHT_PX = (PRINTABLE_HEIGHT_MM / A4_HEIGHT_MM) * A4_HEIGHT_PX;

    // Store original styles
    const originalStyles = {
      width: element.style.width,
      maxWidth: element.style.maxWidth,
      minHeight: element.style.minHeight,
      padding: element.style.padding,
      margin: element.style.margin,
      overflow: element.style.overflow,
      position: element.style.position
    };

    // Set element to exact printable dimensions
    element.style.width = `${PRINTABLE_WIDTH_PX}px`;
    element.style.maxWidth = `${PRINTABLE_WIDTH_PX}px`;
    element.style.minHeight = 'auto';
    element.style.padding = '24px';
    element.style.margin = '0';
    element.style.overflow = 'visible';
    element.style.position = 'relative';
    element.style.boxSizing = 'border-box';

    // Wait for layout reflow
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Capture the element
    const canvas = await html2canvas(element, {
      scale: 2,
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
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Apply same styles to cloned element
          clonedElement.style.width = `${PRINTABLE_WIDTH_PX}px`;
          clonedElement.style.maxWidth = `${PRINTABLE_WIDTH_PX}px`;
          clonedElement.style.minHeight = 'auto';
          clonedElement.style.padding = '24px';
          clonedElement.style.margin = '0';
          clonedElement.style.overflow = 'visible';
          clonedElement.style.position = 'relative';
          clonedElement.style.boxSizing = 'border-box';
          clonedElement.style.transform = 'none';
          clonedElement.style.transformOrigin = 'top left';
          
          // Fix icon sizes in cloned document - Force smaller icons for PDF
          const icons = clonedElement.querySelectorAll('svg');
          icons.forEach((icon: any) => {
            // Force consistent small icon size for PDF export
            icon.style.width = '8px';
            icon.style.height = '8px';
            icon.style.flexShrink = '0';
            icon.style.minWidth = '8px';
            icon.style.minHeight = '8px';
            icon.style.maxWidth = '8px';
            icon.style.maxHeight = '8px';
          });

          // Fix image sizes and aspect ratio
          const images = clonedElement.querySelectorAll('img');
          images.forEach((img: any) => {
            // Check if this is a profile photo (circular)
            if (img.classList.contains('rounded-full') || img.style.borderRadius === '50%') {
              // Force square aspect ratio for profile photos
              const size = Math.min(parseInt(img.style.width) || 96, parseInt(img.style.height) || 96);
              img.style.width = `${size}px`;
              img.style.height = `${size}px`;
              img.style.objectFit = 'cover';
              img.style.objectPosition = 'center';
              img.style.aspectRatio = '1';
            } else {
              // For other images, maintain aspect ratio
              const rect = img.getBoundingClientRect();
              if (rect.width && rect.height) {
                img.style.width = `${rect.width}px`;
                img.style.height = `${rect.height}px`;
              }
              img.style.objectFit = 'contain';
            }
          });
        }
      }
    });

    // Restore original styles
    Object.keys(originalStyles).forEach(key => {
      element.style[key as any] = originalStyles[key as any];
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Calculate scaling and pages
    const canvasWidthMM = PRINTABLE_WIDTH_MM;
    const canvasHeightMM = (canvas.height * PRINTABLE_WIDTH_MM) / canvas.width;
    const pageContentHeight = PRINTABLE_HEIGHT_MM;
    
    console.log(`Canvas: ${canvas.width}x${canvas.height}px`);
    console.log(`Canvas in MM: ${canvasWidthMM}x${canvasHeightMM}mm`);
    console.log(`Page content area: ${PRINTABLE_WIDTH_MM}x${pageContentHeight}mm`);

    // Calculate number of pages needed
    const totalPages = Math.ceil(canvasHeightMM / pageContentHeight);
    console.log(`Total pages needed: ${totalPages}`);

    // Create a temporary canvas for slicing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) {
      throw new Error('Could not get canvas context');
    }

    // Set temp canvas size to match our printable area
    tempCanvas.width = canvas.width;
    const pageHeightInPixels = (pageContentHeight / canvasHeightMM) * canvas.height;

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      // Calculate the slice of the canvas for this page
      const sourceY = pageIndex * pageHeightInPixels;
      const sourceHeight = Math.min(pageHeightInPixels, canvas.height - sourceY);
      
      // Set the temp canvas height for this slice
      tempCanvas.height = sourceHeight;
      
      // Clear and draw the slice
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(
        canvas,
        0, sourceY, canvas.width, sourceHeight, // source
        0, 0, tempCanvas.width, tempCanvas.height // destination
      );
      
      // Convert slice to image data
      const sliceImageData = tempCanvas.toDataURL('image/png', 1.0);
      
      // Calculate the height of this slice in mm
      const sliceHeightMM = (sourceHeight / canvas.height) * canvasHeightMM;
      
      // Add the slice to PDF with proper margins
      pdf.addImage(
        sliceImageData,
        'PNG',
        MARGIN_MM, // X position (left margin)
        MARGIN_MM, // Y position (top margin)
        canvasWidthMM, // Width
        sliceHeightMM, // Height of this slice
        undefined,
        'FAST'
      );

      // Add page number footer
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      
      const pageText = `Page ${pageIndex + 1} of ${totalPages}`;
      const textWidth = pdf.getTextWidth(pageText);
      const footerX = (A4_WIDTH_MM - textWidth) / 2;
      const footerY = A4_HEIGHT_MM - 10; // 10mm from bottom
      
      pdf.text(pageText, footerX, footerY);
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      
      console.log(`Added page ${pageIndex + 1}/${totalPages}`);
    }

    // Add PDF metadata
    pdf.setProperties({
      title: filename.replace('.pdf', ''),
      subject: 'Professional Resume',
      author: 'Resume Generator',
      creator: 'LinkedIn Resume Generator',
      producer: 'jsPDF with html2canvas'
    });

    // Save the PDF
    pdf.save(filename);
    console.log(`PDF exported successfully: ${filename} (${totalPages} pages)`);

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