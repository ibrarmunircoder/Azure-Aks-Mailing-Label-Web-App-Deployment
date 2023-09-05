export const downloadPDF = (base64Data: string, fileName: string) => {
  const anchor = document.createElement("a");
  anchor.href = `data:application/pdf;base64,${base64Data}`;
  anchor.download = fileName || "shipping-label.pdf";
  anchor.click();
};
