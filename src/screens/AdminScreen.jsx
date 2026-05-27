import React, { useState } from 'react';

export default function AdminScreen() {

const [campaigns, setCampaigns] = useState([]);

const [form, setForm] = useState({
    title: '',
    desc: '',
    type: 'campaña',
});

function handleChange(e) {
    setForm({
    ...form,
    [e.target.name]: e.target.value,
    });
}

function handleCreate() {

    if (!form.title || !form.desc) return;

    const newPost = {
    id: Date.now(),
    ...form,
    };

    setCampaigns([...campaigns, newPost]);

    setForm({
    title: '',
    desc: '',
    type: 'campaña',
    });
}

function handleDelete(id) {
    setCampaigns(
    campaigns.filter(c => c.id !== id)
    );
}

return (
    <div className="admin-wrapper fade-in">

    <h1 className="admin-title">
        Panel ONG
    </h1>

    <div className="admin-form">

        <input
        type="text"
        placeholder="Título"
        name="title"
        value={form.title}
        onChange={handleChange}
        />

        <textarea
        placeholder="Descripción"
        name="desc"
        value={form.desc}
        onChange={handleChange}
        />

        <select
        name="type"
        value={form.type}
        onChange={handleChange}
        >
        <option value="campaña">
            Campaña
        </option>

        <option value="voluntariado">
            Voluntariado
        </option>
        </select>

        <button onClick={handleCreate}>
        Crear publicación
        </button>

    </div>

    <div className="admin-posts">

        {campaigns.map(post => (

        <div key={post.id} className="admin-card">

            <span className="admin-badge">
            {post.type}
            </span>

            <h3>{post.title}</h3>

            <p>{post.desc}</p>

            <button
            onClick={() => handleDelete(post.id)}
            >
            Eliminar
            </button>

        </div>

        ))}

    </div>

    </div>
);
}