// Move as declarações para fora do evento "DOMContentLoaded"
const modal = document.getElementById("modal");
const btnSave = document.getElementById("btnSalvar");
const btnCancel = document.getElementById("btnCancelar");
const modalForm = document.querySelector(".modal-form");
const tbody = document.querySelector("tbody");


const openModalLimpo = () => {
  // Limpa os campos do formulário antes de abrir o modal
  document.getElementById("m-fornecedor").value = "";
  document.getElementById("m-equipamento").value = "";
  document.getElementById("m-nserie").value = "";
  document.getElementById("m-ult_mp").value = "";
  document.getElementById("m-prox_mp").value = "";
  document.getElementById("m-contato").value = "";  // Limpa o campo de Contato

  // Altera o título da modal para "Editar Equipamento"
  document.querySelector(".modal-header h2").textContent = "Novo Equipamento";
  // Abre o formulário
  modal.classList.add("active");
};



//Abre o modal para edição de um equipamento
const openModalEdit = () => {
  // Altera o título da modal para "Editar Equipamento"
  document.querySelector(".modal-header h2").textContent = "Editar Equipamento";
  modal.classList.add("active");
};


const closeModal = () => {
  modal.classList.remove("active");
};


//Função para pegar o status do equipamento e adicionar o status ao equipamento
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


//Função para configurar uma nova linha
const appendRow = (data) => {
  const mainRow = tbody.insertRow();
  mainRow.innerHTML = `
    <td>${data.fornecedor}</td>
    <td>${data.equipamento}</td>
    <td>${data.nserie}</td>
    <td>${data.ult_mp}</td>
    <td>${data.prox_mp}</td>
    <td>${getStatus(data.prox_mp)}</td>
    <td class="action-cell">
      <!-- Adiciona o caminho do certificado como um atributo data-certificado -->
      <button onclick="editRow(this)" title="Editar" type="button" class="button green" style="font-size: 20px"><i class="bi bi-pencil-square"></i></button>
      <button onclick="viewCertificate(this)" title="Visualizar Certificado" type="button" class="button pur" style="font-size: 20px" data-certificado="${data.certificado}"><i class="bi bi-file-earmark-text"></i></button>
      <button onclick="deleteRow(this)" title="Excluir" type="button" class="button red" style="font-size: 20px"><i class="bi bi-trash"></i></button>
    </td>
  `;

  if (getStatus(data.prox_mp) === "Atrasada") {
    mainRow.classList.add("records-atrasada");
    // Adiciona o evento de mouseover para exibir a mensagem
    mainRow.addEventListener("mouseover", function() {
      mainRow.title = "Solicitar certificado atualizado";
    });
  } else if (getStatus(data.prox_mp) === "Atenção") {
    mainRow.classList.add("records-atencao");
    // Adiciona o evento de mouseover para exibir a mensagem
    mainRow.addEventListener("mouseover", function() {
      mainRow.title = "Certificado próximo do vencimento";
    });
  }

  // Adicione o contato como uma célula na nova linha
  const contactRow = tbody.insertRow();
  const contactCell = contactRow.insertCell();
  contactCell.className = "contact-row";
  contactCell.colSpan = 7;
  // Verifica se o contato está vazio antes de definir o conteúdo
  contactCell.textContent = data.contato ? `Contato: ${data.contato}` : "Contato: Não informado";
  contactRow.style.display = "none"; // Oculta a linha de contato por padrão

  // Adiciona um evento de clique à linha principal
  mainRow.addEventListener("click", (event) => toggleContactRow(mainRow, event));


};


const toggleContactRow = (mainRow, event) => {
  // Verifica se o clique foi na célula "Ação"
  const isActionButton = event.target.closest(".action-cell");

  if (!isActionButton) {
    // Encontra a linha de contato associada à linha principal
    const contactRow = Array.from(tbody.children).find((row) => row !== mainRow && row.previousElementSibling === mainRow);

    if (contactRow) {
      // Exibe ou oculta a linha de contato
      contactRow.style.display = contactRow.style.display === "none" ? "" : "none";
    }
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
    contato: document.getElementById("m-contato").value,
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
      cells[4].textContent === data.prox_mp &&
      cells[6].textContent.replace("Contato: ", "") === data.contato
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

    // Atualiza o contato na linha
    const contactRow = editingRow.nextElementSibling;
    contactRow.querySelector(".contact-row").textContent = data.contato ? `Contato: ${data.contato}` : "Contato: Não informado";

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

  // Adiciona o contato ao formulário de edição
  const contactRow = editingRow.nextElementSibling;
  document.getElementById("m-contato").value = contactRow.querySelector(".contact-row").textContent.replace("Contato: ", ""); // Corrigido para índice correto

  // Abre o modal para edição
  openModalEdit();
};





//Função para visualizar o certificado de manutenção preventiva
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


//Função para deletar uma linha com confirmação
const deleteRow = (button) => {
  const row = button.closest("tr");

  // Mostrar um alerta de confirmação
  const isConfirmed = confirm("Tem certeza que deseja excluir este equipamento?");

  if (isConfirmed) {
    tbody.removeChild(row);
  }
};


const searchTable = () => {
  const input = document.getElementById("searchInput");
  const filter = input.value.toUpperCase();
  const rows = Array.from(tbody.querySelectorAll("tr:not(.contact-row)"));

  //Percorre as linhas da tabela exceto as linhas de contato
  for (let i = 0; i < rows.length; i++) {
    const cells = Array.from(rows[i].getElementsByTagName("td")).filter((cell) => !cell.classList.contains("contact-row"));
    let found = false;

    //Percorre as células (colunas) da tabela exceto as linhas de contato
    for (let j = 0; j < cells.length; j++) {
      const cellText = cells[j].textContent || cells[j].innerText;

      if (cellText.toUpperCase().indexOf(filter) > -1) {
        found = true;
        break;
      }
    }

    // Exibe ou oculta a linha com base na pesquisa
    rows[i].style.display = found ? "" : "none";
  }
};


document.addEventListener("DOMContentLoaded", function() {
  btnSave.addEventListener("click", saveData);
  btnCancel.addEventListener("click", closeModal);

  // Carregar dados do banco de dados (pode ser um JSON armazenado localmente)
  // Se o dado for salvo em um arquivo JSON, você pode usar fetch para carregar.
  // Exemplo: fetch('data.json').then(response => response.json()).then(data => { /*...*/ });

  // Exemplo de carregamento de dados (substitua pelo seu método de carregamento)
  const sampleData = [
    { fornecedor: "Siemens", equipamento: "Magnetom Skyra", nserie: "12345", ult_mp: "2023-12-01", prox_mp: "2024-02-01" },
    { fornecedor: "Philips", equipamento: "Ingenia 3.0T", nserie: "67890", ult_mp: "2023-01-15", prox_mp: "2024-01-14" },
    { fornecedor: "Siemens", equipamento: "Sensations 64 CT Scanner", nserie: "55668", ult_mp: "2023-12-15", prox_mp: "2023-01-15" },
    { fornecedor: "Philips", equipamento: "Brilliance ICT SP Big Bore CT", nserie: "77890", ult_mp: "2023-01-30", prox_mp: "2023-03-30" },
    { fornecedor: "GE Healthcare", equipamento: "Optima XR240amx", nserie: "54321", ult_mp: "2022-11-20", prox_mp: "2023-01-20" },
    { fornecedor: "Siemens", equipamento: "SOMATOM Force", nserie: "98765", ult_mp: "2022-12-10", prox_mp: "2023-02-10" },
    { fornecedor: "Philips", equipamento: "Azurion 7 C20", nserie: "13579", ult_mp: "2023-01-05", prox_mp: "2024-03-05" },
    { fornecedor: "GE Healthcare", equipamento: "Vivid E95", nserie: "24680", ult_mp: "2023-02-05", prox_mp: "2023-04-05" },
    { fornecedor: "Siemens", equipamento: "Biograph Vision PET/CT", nserie: "11223", ult_mp: "2022-11-25", prox_mp: "2023-01-25" },
    { fornecedor: "Philips", equipamento: "Epiq Elite Ultrasound", nserie: "33445", ult_mp: "2023-01-01", prox_mp: "2023-03-01" },
    { fornecedor: "GE Healthcare", equipamento: "LOGIQ E10 Ultrasound", nserie: "55667", ult_mp: "2023-02-15", prox_mp: "2023-04-15" },
    { fornecedor: "Siemens", equipamento: "Acuson Sequoia Ultrasound", nserie: "77889", ult_mp: "2022-12-15", prox_mp: "2023-02-15" },
    { fornecedor: "Philips", equipamento: "Affiniti 70 Ultrasound", nserie: "99001", ult_mp: "2023-01-20", prox_mp: "2023-03-20" },
    { fornecedor: "Philips", equipamento: "Epic 5 Ultrasound", nserie: "11224", ult_mp: "2023-01-10", prox_mp: "2023-03-10" },
    { fornecedor: "GE Healthcare", equipamento: "Vivid S6", nserie: "33446", ult_mp: "2023-02-20", prox_mp: "2024-04-20" },
    { fornecedor: "GE Healthcare", equipamento: "OEC 9900 Elite C-arm", nserie: "11223", ult_mp: "2022-11-30", prox_mp: "2023-01-30" },
    { fornecedor: "Siemens", equipamento: "Artis Q.zen Angiography", nserie: "33445", ult_mp: "2023-02-10", prox_mp: "2023-04-10" },
    { fornecedor: "Philips", equipamento: "Allura Xper FD20/20", nserie: "55667", ult_mp: "2022-12-05", prox_mp: "2023-02-05" },
    { fornecedor: "GE Healthcare", equipamento: "Centricity 360 PACS", nserie: "77889", ult_mp: "2023-01-10", prox_mp: "2023-03-10" },
    { fornecedor: "Siemens", equipamento: "Symbia Intevo Bold SPECT/CT", nserie: "99001", ult_mp: "2023-02-20", prox_mp: "2023-04-20" },
    { fornecedor: "Philips", equipamento: "IntelliVue MX750 Patient Monitor", nserie: "11223", ult_mp: "2023-12-20", prox_mp: "2024-02-20" },
    { fornecedor: "GE Healthcare", equipamento: "CARESCAPE B850 Monitor", nserie: "33445", ult_mp: "2023-01-25", prox_mp: "2023-03-25" },
    { fornecedor: "Siemens", equipamento: "Mammomat Fusion Mammography", nserie: "55667", ult_mp: "2023-02-01", prox_mp: "2024-04-01" },
    { fornecedor: "Philips", equipamento: "Brilliance 64 CT Scanner", nserie: "77889", ult_mp: "2022-12-25", prox_mp: "2024-01-10" },
    { fornecedor: "GE Healthcare", equipamento: "Discovery MI PET/CT", nserie: "99001", ult_mp: "2023-01-30", prox_mp: "2023-03-30" }
  ];

  sampleData.forEach((data) => appendRow(data));
});