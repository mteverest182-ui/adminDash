import { useState } from "react";

import {
    validateProductField,
    validateProductForm,
    validateProductImage,
} from "../function/ProductValidation"

const useProductForm = (initialForm = {}) => {
    const [form, setForm] = useState(initialForm);
    

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))

        if(touched[name]) {
            const error = validateProductField(name, value);

            setErrors((prev) => ({
                ...prev,
                [name]: error,
            }));
        }
    };

    const handleBlur = (event) => {
        const {name, value} = event.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        const error = validateProductField(name, value);

        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        setTouched((prev) => ({
            ...prev,
            image: true,
        }))

        const error = validateProductImage(file);

        if(error){
            setImage(null);
            setPreview(null);

            setErrors((prev) => ({
                ...prev,
                image: error,
            }));
            return
        }
        setImage(file);
        setPreview(URL.createObjectURL(file));

        setErrors((prev) => ({
            ...prev,
            image: "",
        }));
    };

    const validate = ({
        requireImage = true,
    }= {}) => {
        const newErrors = validateProductForm(
            form,
            requireImage ? image : true,
        );

        setErrors(newErrors);

        setTouched({
            name: true,
            brand: true,
            price: true,
            stock: true,
            ...(requireImage && {image: true}),
        });

        return Object.keys(newErrors).length === 0;
    };

    const getInputClass = (name) => {
        if(!touched[name]) {
            return "input input-bordered w-full";
        }

        if(errors[name]){
        return "input input-bordered input-error w-full";
        }

        return "input input-bordered input-success w-full";
    };

    const getFileInputClass = () => {
        if (!touched.image){
            return "file-input file-input-bordered w-full"
        }

        if(errors.image){
            return "file-input file-input-bordered file-input-error w-full";
        }

        return "file-input file-input-bordered file-input-success w-full";
    };

    const resetForm = () => {
        setForm(initialForm);
        setImage(null);
        setPreview(null);
        setErrors({});
        setTouched({});
    };

    return {
        form,
        setForm,

        image,
        setImage,

        preview,
        setPreview,

        errors,
        touched,

        handleChange,
        handleBlur,
        handleImageChange,

        validate,

        getInputClass,
        getFileInputClass,

        resetForm,
    };

};

export default useProductForm;