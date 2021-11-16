export const formatPrice = (number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number / 100);
};

export const getUniqueValues = (data, type) => {
  let unique = data.map((item) => item[type]);
  if (type === "mausac") {
    unique = unique.flat();
  }
  const stored = [];
  const uniqueArr = [];
  unique.forEach((item) => {
    if (!stored.includes(item.id)) {
      uniqueArr.push(item.name);
      stored.push(item.id);
    }
  });
  // return uniqueArr
  return ["all", ...uniqueArr];
};
export const getUniqueLoaiHang = (data, type) => {
  let unique = data.map((item) => item[type])
  if (type === 'colors') {
    unique = unique.flat()
  }
  return ['all', ...new Set(unique)]
}