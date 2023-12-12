function formatCurency(number: number) {
  return new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(
    number
  );
}

export default {formatCurency};
