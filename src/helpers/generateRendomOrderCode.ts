export const generateOrderCode = () => {
  const random = Math.floor(100 + Math.random() * 900); // 3 digit
  return `ORD-${random}`;
};
