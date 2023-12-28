const linkCadastrar = document.querySelectorAll(".form-box .bottom-link a");
const formPopup = document.querySelector(".form-popup ");
const loginForm = document.querySelector(".form-box.login form");
const signupForm = document.querySelector(".form-box.signup form");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const emailValidation = document.getElementById("emailValidation");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Função para alternar entre o formulário de login e cadastro
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

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".form-box.login form");
    const signupForm = document.querySelector(".form-box.signup form");
    const confirmPasswordInput = signupForm.querySelector("#signupConfirmPassword");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const signupEmailInput = signupForm.querySelector("#signupEmail");

    // Escutador para o input de email para mostrar o span de validação de email
    signupEmailInput.addEventListener("input", function (){
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

    // Escutador para o input de confirmação de senha para mostrar o span enquanto digita
    confirmPasswordInput.addEventListener("input", function () {
        const password = signupForm.querySelector("#signupSenha").value;
        const confirmPassword = confirmPasswordInput.value;

        // Verificar se as senhas correspondem
        if (password !== confirmPassword) {
            confirmPasswordError.textContent = "As senhas não correspondem.";
            if (confirmPassword === ""){
                confirmPasswordError.textContent = "Este campo é obrigatório";
            }
        } else {
            confirmPasswordError.textContent = "";
        }
    });

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = loginForm.querySelector("input[type='text']").value;
        const password = loginForm.querySelector("input[type='password']").value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("Usuário autenticado:", userCredential.user);
                // Redirecione ou execute outras ações após o login
            })
            .catch((error) => {
                console.error("Erro de autenticação:", error.message);
            });
    });

    signupForm.addEventListener("submit", function (e) {
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

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("Usuário cadastrado:", userCredential.user);
                console.log("Nome da empresa:", companyName);
                // Redirecione ou execute outras ações após o cadastro
            })
            .catch((error) => {
                console.error("Erro de cadastro:", error.message);
            });
    });
});
