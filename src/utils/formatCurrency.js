// Ubah angka mentah jadi format ribuan dengan 2 angka di belakang koma
export const formatRupiah = (amount) => {
  return amount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
};
