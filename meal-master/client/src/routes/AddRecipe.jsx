import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function AddRecipe() {
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        userId: "",
        imageUrl: null,
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0],
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('userId', formData.userId);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                setStatus('Recipe submitted successfully!');
            } else {
                const errorData = await response.json();
                setStatus(`Error: ${errorData.error}`);
            }
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
        setFormData({ name: "", description: "", userId: "", imageUrl: "" });
        navigate("/");
    };
    return (
        <div>
            <h2>Submit a Recipe</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="userId">User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
}
export default AddRecipe;