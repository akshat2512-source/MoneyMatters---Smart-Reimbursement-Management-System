import Tesseract from 'tesseract.js';

export const scanReceipt = async (imageFile) => {
  const { data: { text } } = await Tesseract.recognize(imageFile, 'eng', {
    logger: (m) => console.log(m),
  });

  const amount = text.match(/(?:total|amount|rs\.?|inr|\$|€|£)[\s:]*([0-9,]+\.?[0-9]*)/i)?.[1]?.replace(',', '');
  const date   = text.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/)?.[0];
  const lines  = text.split('\n').filter(l => l.trim().length > 3);

  return { rawText: text, amount, date, description: lines.slice(0, 3).join(', ') };
};
