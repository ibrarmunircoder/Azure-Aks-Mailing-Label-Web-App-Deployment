export const openPDFByBase64 = (base64Data: string) => {
  const pdfWindow = window.open("");
  //   @ts-ignore
  pdfWindow.document.write(
    "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
      encodeURI(base64Data) +
      "'></iframe>"
  );
};
