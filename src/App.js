import React from 'react'
import sob from './sob.png'

const firebase = window.firebase;

export default (props) => {
  const [data, setData] = React.useState({});
  const [sobremesa, setSobremesa] = React.useState([]);

  const handleDataInput = tipo => e => {
    e.preventDefault();
    const target = e.target;
    if (tipo === 'preco') {
      setData(old => ({...old, [tipo]: Number(target.value)}));
    } else {
      setData(old => ({...old, [tipo]: target.value}));
    }
  }

  const handleAdd = e => {
    e.preventDefault();
    setSobremesa(old => [...old, data]);
    firebase.firestore().collection("Produtos").add(data)
    .then(res => console.log(res))
    .catch(err => console.err(err))
    setData({})
  }

  React.useEffect(() => {
    async function foo() {
      firebase.firestore().collection("Produtos").get(data)
      .then(snap => {
        const res = []
        snap.forEach(doc => {
          res.push(doc.data())
        })
        setSobremesa(old => [...old, ...res])
      })
      .catch(err => console.err(err))
    }
    foo();
  }, []);

  return (
    <div>
      <h1><img src={sob} alt="SobremesaSLZ" width="239" height="239" /></h1>
      <div className="content">
        <form id="add-doce-form">
          <input type="text" name="nome" placeholder="Nome" onChange={handleDataInput('nome')}/>
          <input type="text" name="sabor" placeholder="Sabor" onChange={handleDataInput('sabor')}/>
          <input type="int" name="desc" placeholder="Descrição" onChange={handleDataInput('descricao')}/>
          <input type="text" name="preco" placeholder="Preço" onChange={handleDataInput('preco')}/>
          <button onClick={handleAdd}>Add Produto</button>
        </form>
        <ul id="doce-list"></ul>
      </div>
      <div>
      {sobremesa.map(sob => (
        <div className="box">
          <p>Nome: {sob.nome}</p>
          <p>Sabor: {sob.sabor}</p>
          <p>Descrição: {sob.descricao}</p>
          <p>Preço: {sob.preco}</p>
          <button onClick={handleAdd}>Apagar</button>
          <button onClick={handleAdd}>Editar</button>
        </div>
        ))}
      </div>
    </div>
  );
}
