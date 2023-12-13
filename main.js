// Move as declarações para fora do evento "DOMContentLoaded"
const modal = document.getElementById("modal");
const btnSave = document.getElementById("btnSalvar");
const btnCancel = document.getElementById("btnCancelar");
const modalForm = document.querySelector(".modal-form");
const tbody = document.querySelector("tbody");



// Funções globais
const openModalLimpo = () => {
  // Limpa os campos do formulário antes de abrir o modal
  document.getElementById("m-fornecedor").value = "";
  document.getElementById("m-equipamento").value = "";
  document.getElementById("m-nserie").value = "";
  document.getElementById("m-ult_mp").value = "";
  document.getElementById("m-prox_mp").value = "";

  // Altera o título da modal para "Editar Equipamento"
  document.querySelector(".modal-header h2").textContent = "Novo Equipamento";
  //Abre o formulário
  modal.classList.add("active");
};

const openModalEdit = () => {
  // Altera o título da modal para "Editar Equipamento"
  document.querySelector(".modal-header h2").textContent = "Editar Equipamento";
  modal.classList.add("active");
};

const closeModal = () => {
  modal.classList.remove("active");
};

const getStatus = (nextPreventiveDate) => {
  const currentDate = new Date();
  const nextPreventive = new Date(nextPreventiveDate);

  // Define as horas, minutos e segundos da data atual como 00:00:00
  currentDate.setHours(0, 0, 0, 0);

  // Define as horas, minutos e segundos da próxima preventiva como 00:00:00
  nextPreventive.setHours(0, 0, 0, 0);

  // Adiciona um mês à data atual
  const oneMonthLater = new Date(currentDate);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  if (nextPreventive >= oneMonthLater) {
    return "Ok";
  } else if (nextPreventive >= currentDate) {
    return "Atenção";
  } else {
    return "Atrasada";
  }
};


const appendRow = (data) => {
  const row = tbody.insertRow();
  row.innerHTML = `
    <td>${data.fornecedor}</td>
    <td>${data.equipamento}</td>
    <td>${data.nserie}</td>
    <td>${data.ult_mp}</td>
    <td>${data.prox_mp}</td>
    <td>${getStatus(data.prox_mp)}</td>
    <td>
      <!-- Adiciona o caminho do certificado como um atributo data-certificado -->
      <button onclick="editRow(this)" title="Editar" type="button" class="button green" style="font-size: 20px"><i class="bi bi-pencil-square"></i></button>
      <button onclick="viewCertificate(this)" title="Visualizar Certificado" type="button" class="button pur" style="font-size: 20px" data-certificado="${data.certificado}"><i class="bi bi-file-earmark-text"></i></button>
      <button onclick="deleteRow(this)" title="Excluir" type="button" class="button red" style="font-size: 20px"><i class="bi bi-trash"></i></button>
    </td>
  `;



  if (getStatus(data.prox_mp) === "Atrasada") {
    row.classList.add("records-atrasada");
  } else if (getStatus(data.prox_mp) === "Atenção") {
    row.classList.add("records-atencao");
  }

};


// Variável global para armazenar a linha que está sendo editada
let editingRow = null;

const saveData = () => {
  const data = {
    fornecedor: document.getElementById("m-fornecedor").value,
    equipamento: document.getElementById("m-equipamento").value,
    nserie: document.getElementById("m-nserie").value,
    ult_mp: document.getElementById("m-ult_mp").value,
    prox_mp: document.getElementById("m-prox_mp").value,
  };

  // Verificar se todos os campos foram preenchidos
  if (!data.fornecedor || !data.equipamento || !data.nserie || !data.ult_mp || !data.prox_mp) {
    alert("Por favor, preencha todos os campos do formulário.");
    return;
  }

  // Verificar se já existe uma linha exatamente igual na tabela
  const existingRow = Array.from(tbody.children).find((row) => {
    const cells = row.querySelectorAll("td");
    return (
      cells[0].textContent === data.fornecedor &&
      cells[1].textContent === data.equipamento &&
      cells[2].textContent === data.nserie &&
      cells[3].textContent === data.ult_mp &&
      cells[4].textContent === data.prox_mp
    );
  });

  if (existingRow) {
    alert("Equipamento já cadastrado.");
    return;
  }

  if (editingRow) {
    // Atualizar os dados da linha existente
    const cells = editingRow.querySelectorAll("td");
    cells[0].textContent = data.fornecedor;
    cells[1].textContent = data.equipamento;
    cells[2].textContent = data.nserie;
    cells[3].textContent = data.ult_mp;
    cells[4].textContent = data.prox_mp;

    // Atualizar o status da linha
    const statusCell = cells[5];
    statusCell.textContent = getStatus(data.prox_mp);

    // Atualizar a classe da linha se necessário
    // Remove todas as classes anteriores
    editingRow.classList.remove("records-atrasada", "records-atencao", "records", "tr");

    if (getStatus(data.prox_mp) === "Atrasada") {
      editingRow.classList.add("records-atrasada");
    } else if (getStatus(data.prox_mp) === "Atenção") {
      editingRow.classList.add("records-atencao");
    } else if (getStatus(data.prox_mp) === "Ok") {
      editingRow.classList.add("records");
    }

    editingRow = null; // Limpar a variável de edição
  } else {
    // Adicionar uma nova linha
    appendRow(data);
  }

  closeModal();
};


const editRow = (button) => {
  editingRow = button.closest("tr");
  const cells = editingRow.querySelectorAll("td");

  // Preencher o formulário de edição com os valores da linha
  document.getElementById("m-fornecedor").value = cells[0].textContent;
  document.getElementById("m-equipamento").value = cells[1].textContent;
  document.getElementById("m-nserie").value = cells[2].textContent;
  document.getElementById("m-ult_mp").value = cells[3].textContent;
  document.getElementById("m-prox_mp").value = cells[4].textContent;

  // Abre o modal para edição
  openModalEdit();
};


const viewCertificate = (button) => {
  const row = button.closest("tr");
  const cells = row.querySelectorAll("td");
  const certificatePath = cells[5].textContent; // Assumindo que a URL do certificado está na sexta coluna (índice 5)

  // Verifica se há uma URL válida
  if (certificatePath) {
    // Abre o certificado em uma nova aba
    window.open(certificatePath, "_blank");
  } else {
    alert("Certificado não disponível para visualização.");
  }
};


const deleteRow = (button) => {
  const row = button.closest("tr");
  tbody.removeChild(row);
};

document.addEventListener("DOMContentLoaded", function() {
  btnSave.addEventListener("click", saveData);
  btnCancel.addEventListener("click", closeModal);

  // Carregar dados do banco de dados (pode ser um JSON armazenado localmente)
  // Se o dado for salvo em um arquivo JSON, você pode usar fetch para carregar.
  // Exemplo: fetch('data.json').then(response => response.json()).then(data => { /*...*/ });

  // Exemplo de carregamento de dados (substitua pelo seu método de carregamento)
  const sampleData = [
    { fornecedor: "Empresa A", equipamento: "Equipamento 1", nserie: "123", ult_mp: "2023-01-01", prox_mp: "2023-12-13" }
  ];

  sampleData.forEach((data) => appendRow(data));
});