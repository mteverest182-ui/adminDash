import { useState } from "react";

function RupiahInput({
  value,
  onChange,
  name = "price",
  className = "",
}) {
  const [focused, setFocused] = useState(false);

  const formatRupiah = (number) => {
    if (!number) return "";

    return new Intl.NumberFormat("id-ID").format(number);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        Rp
      </span>

      <input
        type="text"
        inputMode="numeric"
        name={name}
        value={focused ? value : formatRupiah(value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          onChange(raw);
        }}
        placeholder="Masukkan Harga"
        className={`input w-full ${className}`}
        required
      />
    </div>
  );
}

export default RupiahInput;
