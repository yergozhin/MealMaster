import React, { useState, useEffect} from "react";
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
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            fetch('/auth/check-login', {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === 'User is logged in') {
                        fetch(`/api/users/${data.user.userId}`)
                            .then((response) => response.json())
                            .then((userData) => {
                                setUser(userData); // Set the full user data
                            })
                            .catch((error) => {
                                console.error('Error fetching user data:', error);
                                setUser(null); // In case of error, clear user data
                            });
                    } else {
                        setUser(null);
                    }
                })
                .catch((error) => {
                    console.error('Error during login check:', error);
                    setUser(null);
                });
        } else {
            setUser(null);
        }
    }, []);
    const handleSubmit = async (e) => {
        if(!user){
            navigate("/");
            return;
        }
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('userId', user[0].id);
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