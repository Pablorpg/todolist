const BASE_URL = 'http://localhost:3333/api/items'

const pegarValorDaUrl = (name) => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
}

const itemId = pegarValorDaUrl("id")
if(!itemId){
    console.log('Falta o ID')
}

const listItem = async (itemId) => {
    try {
        const res = await fetch(`${BASE_URL}/${itemId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!res.ok) {
            console.log("Erro ao buscar item");
            return;
        }
        const item = await res.json();
        console.log(item);
        mostrarItem(item);
    } catch (error) {
        console.log(error);
    }
};

const mostrarItem = (item) => {
    const formContainer = document.querySelector('#form-container');

    formContainer.innerHTML = `
        <h2 class="form-container__title">Atualizar Atividades</h2>
        <form id="item-form" class="item-form" action="" method="post">
            <input
                type="text"
                name="name"
                id="name"
                class="item-form__input"
                placeholder="Digite a atividade"
                value="${item.name}"
            />
            <textarea
                id="description"
                class="item-form__textarea"
                placeholder="Descreva a sua atividade"
            >${item.description || ""}</textarea>
            <button type="submit" class="item-form__button item-form__button--edit">Atualizar</button>
        </form>
        <div id="message" class="message"></div>
    `;

    const form = document.getElementById('item-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (validar()) {
            salvarItem(item.id);
        } else {
            console.log('Validação falhou');
        }
    });
}

function validar() {
    const nome = document.getElementById('name');
    const descricao = document.getElementById('description');

    const nomeValidar = nome.value;
    const descricaoValidar = descricao.value;

    let isValid = true;

    if (nomeValidar === "" || nomeValidar.length < 5) {
        nome.classList.add("erro");
        isValid = false;
    }
     else {
        nome.classList.remove("erro");
    }

    if (descricaoValidar === "") {
        descricao.classList.add("erro");
        isValid = false;
    } else {
        descricao.classList.remove("erro");
    }

    return isValid;
}

const salvarItem = async (itemId) => {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    try {
        const res = await fetch(`${BASE_URL}/${itemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, description })
        });

        if (!res.ok) {
            console.log('Erro ao atualizar');
            return;
        }
        console.log(await res.json());
    } catch (error) {
        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (itemId) {
        listItem(itemId);
    } else {
        console.log('ID da atividade não foi encontrado');
    }
});
