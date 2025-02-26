const BASE_URL = "http://localhost:3333/api";

const formCad = document.getElementById("item-form");
const message = document.getElementById("message");

//Funções utilitárias
const showMessage = (text, cor) => {
  message.textContent = text;
  message.style.color = cor;
};

//Iniciar o cadastro de items
const handleFormSubmit = async (event) => {
  event.preventDefault();

  const campoName = document.getElementById("name").value;
  const campoDescription = document.getElementById("description").value;

  const item = {
    name: campoName,
    description: campoDescription,
  };

  await sendItem(item);
  // console.log(JSON.stringify(item))
};
const sendItem = async (objItem) => {
  // console.log(objItem)
  try {
    const res = await fetch(`${BASE_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Connection: "close", //Obrigatório no POST
      },
      body: JSON.stringify(objItem),
    });

    if (!res.ok) {
      const error = await res.json().catch( () => ({
        message: 'Erro desconhecido'
      }))
      console.log(error)
      if(error.messages && Array.isArray(error.messages)){
        const errorContainer = document.getElementById('message')
        errorContainer.innerHTML = ''

        error.messages.forEach((err) => {
          const errorMessage = document.createElement('p')
          errorMessage.textContent = ` Campo ${err.field} vazio: ${err.error}`
          errorMessage.style.color = 'red'
          errorContainer.appendChild(errorMessage)
        });
      }else{
        showMessage(`Error: ${error.messages} || Erro inesperado`, 'red')
      }
       return
    }
    console.log("Item cadastrado");
  } catch (error) {
    console.log(error);
  }

  showMessage("Atividade cadastrada", "green");
};
//Fim do cadastro de itens

//Inicar a buscar/mostrar os items
const listItems = async () => {
  try {
    const res = await fetch(`${BASE_URL}/items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      showMessage("Por favor, cadastre um item.", "red")
      return;
    }

    const items = await res.json();
    console.log(items);
    await showItems(items);
  } catch (error) {
    console.log("Erro:", error);
  }
};
const showItems = async (items) => {
  const itemList = document.getElementById("item-list");
  itemList.innerHTML = "";
  //map(()=>``)
  const cards = items
    .map(
      (item) => `
        <article class="item-card">
            <header class="item-card__header">
            <h2 class="item-card__title">${item.name}</h2>
            </header>

            <section class="item-card__body">
            <p class="item-card__description">
                ${item.description}
            </p>
            </section>

            <footer class="item-card__footer">
            <button onclick="editItem(${item.id})" class="item-card__button item-card__button--edit">
                Editar
            </button>
            <button onclick="deleteItem(${item.id})" class="item-card__button item-card__button--delete">
                Excluir
            </button>
            </footer>
        </article>
    `
    )
    .join("");
  itemList.innerHTML = cards;
};
//fim da buscar/mostrar os items

//inicio excluir item
const deleteItem = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/items/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      if (error.message === "Item não encontrado") {
        showMessage("Item não cadastrado.", "red");
      } else {
        showMessage("Item não excluído", "red");
      }
      return;
    }
    showMessage("Item excluído com sucesso", "green");
  } catch (error) {
    console.log(error);
    showMessage("Erro ao tentar excluir o item.", "red");
  }
};

//fim excluir item

//inicio Editar
const editItem = async (id) => {
  const url = `pages/item.html?id=${id}`;
  window.location = url
};
//fim Editar

//Eventos
formCad.addEventListener("submit", handleFormSubmit);
document.addEventListener("DOMContentLoaded", listItems);

function validarFormulario() {

  const campoName = document.getElementById("name")
  const campoDescricao = document.getElementById("description")
  const vall = document.getElementById("vali")
  const vall1 = document.getElementById("vali1")

  const validarName = campoName.value
  const validarDescricao = campoDescricao.value
  
  if (validarName.length < 5) {
    vall.style.color = "red";
    vall.textContent = "A descrição deve ter pelo menos 5 caracteres:";
  } else {
    vall.textContent = ""
  }

  if (validarDescricao.length < 5) {
    vall1.style.color = "red";
    vall1.textContent = "Preencha o campo nome corretamente com 5 caracteres ou mais:";
  } else {
    vall1.textContent = "";
  }
}