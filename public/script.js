// mainScript.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import firebaseConfig from './firebaseConfig.js';

// Função para inicializar o Firebase
function initFirebase() {
    // Inicialização do Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getFirestore();

    return { auth, db };
}

const { auth, db } = initFirebase();
// Exporta a função initFirebase e a instância do Firestore
export { initFirebase, db, auth };


document.addEventListener("DOMContentLoaded", function () {
    

    const linkCadastrar = document.querySelectorAll(".form-box .bottom-link a");
    const formPopup = document.querySelector(".form-popup ");
    const loginForm = document.querySelector(".form-box.login form");
    const signupForm = document.querySelector(".form-box.signup form");
    const confirmPasswordInput = signupForm.querySelector("#signupConfirmPassword");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const emailValidation = document.getElementById("emailValidation");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Evento disparado quando o formulário de login é enviado
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = loginForm.querySelector("input[type='text']").value;
        const password = loginForm.querySelector("input[type='password']").value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Usuário autenticado:", userCredential.user);

                // Redirecionar para index.html após o login bem-sucedido
                window.location.href = "index.html";
            })
            .catch((error) => {
                console.error("Erro de autenticação:", error.message);
                alert("Credenciais inválidas. Verifique o usuário e senha ou faça seu cadastro.");
            });
    });

    // Evento disparado quando o formulário de cadastro é enviado
    signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

        const companyName = signupForm.querySelector("#signupEmpresa").value;
        const email = signupForm.querySelector("#signupEmail").value;
        const password = signupForm.querySelector("#signupSenha").value;
        const confirmPassword = confirmPasswordInput.value;

        // Verificar novamente as senhas antes de enviar o formulário
        if (password !== confirmPassword) {
            console.error("As senhas não correspondem.");
            confirmPasswordError.textContent = "As senhas não correspondem.";
            return;
        }

        // Limpar o span de erro se as senhas são iguais
        confirmPasswordError.textContent = "";

        try {
            // Criar usuário no Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            console.log("Usuário cadastrado:", userCredential.user);
            console.log("Nome da empresa:", companyName);

            // Adicionar informações adicionais ao Firestore na coleção "Controle de EMH de Terceiros"
            const userDocRef = await addDoc(collection(db, "users"), {
                fornecedor: companyName, // Nome da empresa como fornecedor
                usuario: email,          // Email como nome de usuário
                userId: userCredential.user.uid,
            });

            console.log("Documento do usuário adicionado com ID:", userDocRef.id);
            alert("Cadastro realizado com sucesso.", "Faça login para entrar no sistema.");

            window.location.href = "login.html";
            
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.error("Erro de cadastro:", "O e-mail já está em uso. Por favor, escolha outro e-mail.");
                // Exiba uma mensagem para o usuário informando que o e-mail já está em uso
                alert("E-mail já cadastrado. Por favor, escolha outro e-mail.")
            } else {
                console.error("Erro de cadastro:", error.message);
            }
        }
    });


    // Evento disparado quando o input de email do formulário de cadastro é alterado
    const signupEmailInput = signupForm.querySelector("#signupEmail");
    signupEmailInput.addEventListener("input", function () {
        const email = signupForm.querySelector("#signupEmail").value;

        if (!emailRegex.test(email)) {
            console.error("E-mail inválido.");
            emailValidation.textContent = "Digite um e-mail válido."; // Exibe mensagem de erro de e-mail

            // Se o campo de e-mail estiver vazio, remova a mensagem de erro
            if (email.trim() === "") {
                emailValidation.textContent = "";
            }

        } else {
            // Remover a mensagem de erro se o email for válido
            emailValidation.textContent = "";
        }
    });

    // Evento disparado quando o input de confirmação de senha do formulário de cadastro é alterado
    confirmPasswordInput.addEventListener("input", function () {
        const password = signupForm.querySelector("#signupSenha").value;
        const confirmPassword = confirmPasswordInput.value;

        // Verificar se as senhas correspondem
        if (password !== confirmPassword) {
            confirmPasswordError.textContent = "As senhas não correspondem.";
            if (confirmPassword === "") {
                confirmPasswordError.textContent = "Este campo é obrigatório";
            }
        } else {
            confirmPasswordError.textContent = "";
        }
    });

    // Evento disparado quando os links de login/cadastro são clicados
    linkCadastrar.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            // Reseta os valores dos campos do formulário ao mudar entre os formulários
            loginForm.reset();
            signupForm.reset();
            confirmPasswordError.textContent = "";

            formPopup.classList[link.id === "signup-link" ? 'add' : 'remove']("show-signup");
        });
    });
});
