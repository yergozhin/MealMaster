
import React, { useState } from "react";

const AddTranslation = () => {
    const [translationKey, setTranslationKey] = useState("");
    const [languageCode, setLanguageCode] = useState("");
    const [text, setText] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!translationKey || !languageCode || !text) {
            setMessage("All fields are required!");
            return;
        }

        try {
            const response = await fetch("/api/translations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    translationKey,
                    languageCode,
                    text,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message || "Translation added successfully!");
                setTranslationKey("");
                setLanguageCode("");
                setText("");
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || "Error adding translation");
            }
        } catch (error) {
            setMessage("An unexpected error occurred");
            console.error("Error:", error);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
            <h2>Add Translation</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="translationKey" style={{ display: "block", marginBottom: "5px" }}>
                        Translation Of Text:
                    </label>
                    <input
                        type="text"
                        id="translationKey"
                        value={translationKey}
                        onChange={(e) => setTranslationKey(e.target.value)}
                        placeholder="Enter text to translate"
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="languageCode" style={{ display: "block", marginBottom: "5px" }}>
                        To Language
                    </label>
                    <input
                        type="text"
                        id="languageCode"
                        value={languageCode}
                        onChange={(e) => setLanguageCode(e.target.value)}
                        placeholder="e.g., en or es"
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="text" style={{ display: "block", marginBottom: "5px" }}>
                        Translated Text
                    </label>
                    <textarea
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter the translated text"
                        style={{ width: "100%", padding: "8px", height: "80px" }}
                    />
                </div>

                <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
                    Add Translation
                </button>
            </form>

            {message && (
                <div style={{ marginTop: "20px", color: message.includes("successfully") ? "green" : "red" }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default AddTranslation;
