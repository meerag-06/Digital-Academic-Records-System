import QRCode from 'qrcode.react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Generate QR Code
export function generateQRCode(data, size = 256) {
  return (
    <QRCode
      value={JSON.stringify(data)}
      size={size}
      level="H"
      includeMargin={true}
      renderAs="canvas"
    />
  )
}

// Download QR Code as image
export function downloadQRCode(data, filename = 'qrcode.png') {
  const qr = document.createElement('div')
  qr.innerHTML = generateQRCode(data)
  
  setTimeout(() => {
    const canvas = qr.querySelector('canvas')
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }, 100)
}

// Generate PDF from HTML element
export async function generatePDFFromHTML(elementId, filename = 'document.pdf') {
  try {
    const element = document.getElementById(elementId)
    if (!element) throw new Error('Element not found')

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    const ratio = canvas.width / canvas.height
    const pdfRatio = pdfWidth / pdfHeight

    let width = pdfWidth
    let height = pdfWidth / ratio

    if (height > pdfHeight) {
      height = pdfHeight
      width = pdfHeight * ratio
    }

    const x = (pdfWidth - width) / 2
    const y = (pdfHeight - height) / 2

    pdf.addImage(imgData, 'PNG', x, y, width, height)
    pdf.save(filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

// Generate Mark Sheet PDF
export function generateMarkSheetPDF(student, marks, filename = 'marksheet.pdf') {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = 20

  // Header
  pdf.setFontSize(18)
  pdf.text('Academic Mark Sheet', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  // Student Information
  pdf.setFontSize(11)
  pdf.text(`Student ID: ${student.student_id}`, 20, yPosition)
  yPosition += 7
  pdf.text(`Name: ${student.first_name} ${student.last_name}`, 20, yPosition)
  yPosition += 7
  pdf.text(`Department: ${student.department}`, 20, yPosition)
  yPosition += 7
  pdf.text(`Batch: ${student.batch_year}`, 20, yPosition)
  yPosition += 10

  // Marks Table
  pdf.setFontSize(10)
  const tableData = marks.map(mark => [
    mark.semester,
    mark.subject,
    mark.internal_marks || '-',
    mark.external_marks || '-',
    mark.total_marks || '-',
    mark.grade || '-',
  ])

  pdf.autoTable({
    startY: yPosition,
    head: [['Sem', 'Subject', 'Internal', 'External', 'Total', 'Grade']],
    body: tableData,
    margin: { left: 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: [74, 144, 226], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [234, 244, 255] },
  })

  pdf.save(filename)
}

// Generate Receipt PDF
export function generateReceiptPDF(payment, student, filename = 'receipt.pdf') {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  let yPosition = 20

  // Header
  pdf.setFontSize(16)
  pdf.text('Fee Receipt', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  // Receipt Details
  pdf.setFontSize(10)
  pdf.text(`Receipt No: ${payment.receipt_number}`, 20, yPosition)
  yPosition += 6
  pdf.text(`Date: ${new Date(payment.payment_date).toLocaleDateString('en-IN')}`, 20, yPosition)
  yPosition += 10

  // Student Details
  pdf.text(`Student ID: ${student.student_id}`, 20, yPosition)
  yPosition += 6
  pdf.text(`Name: ${student.first_name} ${student.last_name}`, 20, yPosition)
  yPosition += 6
  pdf.text(`Department: ${student.department}`, 20, yPosition)
  yPosition += 10

  // Amount
  pdf.setFontSize(12)
  pdf.text(`Amount Paid: ₹${payment.amount_paid}`, 20, yPosition)
  yPosition += 6
  pdf.text(`Payment Method: ${payment.payment_method}`, 20, yPosition)
  yPosition += 8

  // Footer
  pdf.setFontSize(8)
  pdf.text('This is a computer-generated receipt. No signature required.', 20, pageHeight - 20)

  pdf.save(filename)
}

// Generate Certificate PDF
export function generateCertificatePDF(student, certificateType, filename = 'certificate.pdf') {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Background color
  pdf.setFillColor(234, 244, 255)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')

  // Border
  pdf.setDrawColor(74, 144, 226)
  pdf.setLineWidth(3)
  pdf.rect(10, 10, pageWidth - 20, pageHeight - 20)

  // Title
  pdf.setFontSize(28)
  pdf.setTextColor(31, 58, 96)
  pdf.text(certificateType.toUpperCase(), pageWidth / 2, 50, { align: 'center' })

  // Content
  pdf.setFontSize(14)
  pdf.setTextColor(0, 0, 0)
  pdf.text('This is to certify that', pageWidth / 2, 80, { align: 'center' })

  pdf.setFontSize(18)
  pdf.setFont(undefined, 'bold')
  pdf.text(`${student.first_name} ${student.last_name}`, pageWidth / 2, 105, { align: 'center' })

  pdf.setFontSize(12)
  pdf.setFont(undefined, 'normal')
  pdf.text(`(Student ID: ${student.student_id})`, pageWidth / 2, 125, { align: 'center' })

  pdf.text(`Department: ${student.department}`, pageWidth / 2, 150, { align: 'center' })

  pdf.text(`has successfully completed the program in ${student.department}.`, pageWidth / 2, 175, { align: 'center' })

  // Date and signature
  pdf.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 40, 210)
  pdf.text('Principal Signature', pageWidth - 60, 210)

  pdf.save(filename)
}
