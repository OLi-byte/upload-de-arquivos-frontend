import { useState, useEffect } from "react";
import "./styles.css";

const UploadComponent = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/items`);
      const data = await response.json();
      setItems(Array.isArray(data.itens) ? data.itens : []);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !title || !description) {
      alert("Preencha todos os campos!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await fetch(`${API_URL}/api/v1/items`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setImageUrl(`${data.item.image_url}`);
        fetchItems();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao enviar o arquivo");
    }
  };

  const filteredItems = search
    ? items.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      )
    : items;

  return (
    <div className="container">
      <h2>Upload de Arquivo</h2>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Enviar</button>

      {imageUrl && (
        <div className="image-preview">
          <p>Arquivo enviado com sucesso!</p>
          <img src={imageUrl} alt="Imagem enviada" />
        </div>
      )}

      <h2>Buscar Itens</h2>
      <input
        type="text"
        placeholder="Pesquisar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Itens Cadastrados</h2>
      <ul className="items-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <li key={item.id} className="item">
              <img src={`${item.image_url}`} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))
        ) : (
          <p>Nenhum item encontrado.</p>
        )}
      </ul>
    </div>
  );
};

export default UploadComponent;
