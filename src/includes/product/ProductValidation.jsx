export const validateProductField = (name, value) => {
    switch(name){
        case "name":
            if(!value.trim()) {
                return "Nama product wajib diisi";
            }

            if(value.trim().length <3 ) {
                return "Nama Product minimal 3 karakter";
            }

            return "";

            case "brand":
                if(!value.trim()){
                    return "Brand Wajib diisi'";
                }

                if(value.trim().length < 2) {
                    return "Brand minimal 2 karakter";
                }

                return "";

            case "gender":
                if(!value){
                    return "Gender Wajib Dipilih";
                }
                
                if(!["MEN", "WOMEN"].includes(value)){
                    return "Gender Tidak Valid";
                }

                return "";

            case "categoryId":
                if(!value){
                    return "Category Wajib Dipilih";
                }
                return "";

                case "price":
                    if(value === ""){
                        return "Harga Wajib diisi";
                    }

                    if(Number(value) <= 0){
                        return "Harga harus lebih besar dari 0";
                    }

                    return "";

                case "discountPercent":
                    if(value === "" || value === null || value === undefined){
                        return "";
                    }
                    
                    if(!Number.isInteger(Number(value))){
                        return "Discount harus berupa angka bulat";
                    }

                    if (Number(value) < 0){
                        return "Discount tidak boleh kurang dari 0%";
                    }

                    if(Number(value) > 100){
                        return "Discount tidak boleh lebih dari 100%";
                    }

                    return "";
                
                case "stock":
                    if(value === ""){
                        return "Stock wajib diisi";
                    }
                    if(Number(value) < 0 ) {
                        return "Stcok tidak boleh kurang dari 0";
                    }

                    if(!Number.isInteger(Number(value))) {
                        return "Stock harus berupa angka bulat";
                    }

                    return "";

                    default:
                        return "";
    }               
};

                export const validateProductForm = (form, image = null) => {
                    const errors = {};

                    Object.entries(form).forEach(([name, value]) => {
                        const error = validateProductField(name, value);

                        if(error){
                            errors[name] = error;
                        }
                    });

                    if(!image){
                        errors.image = "Foto product wajib di pilih";
                    }

                    return errors;
                };

                export const validateProductImage = (file) => {
                    if (!file) {
                        return "Foto Product wajib dipilih";
                    }

                    if(!file.type.startsWith("image/")){
                        return "File harus berupa gambar";
                    }

                    if(file.size >5 * 1024 * 1024) {
                        return "Ukuran Gambar maksimal 5MB";
                    }

                    return "";
                };