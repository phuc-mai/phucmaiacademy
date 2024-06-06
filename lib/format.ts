export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: "CAD",
  }).format(amount);
};

