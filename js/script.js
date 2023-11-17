document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const alertDiv = document.querySelector('.alert');
    const listarBtn = document.getElementById('listarBtn');
    const limparBtn = document.getElementById('limparBtn');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const buttonClicked = event.submitter; // Captura o botão clicado
        let errorMessage = '';

        // Obter os valores dos campos do formulário
        const nome = document.getElementById('nome').value;
        const sobrenome = document.getElementById('sobrenome').value;
        const dataNascimento = document.getElementById('dataNascimento').value;
        const tipoCliente = document.getElementById('tipoCliente').value;
        const endereco = document.getElementById('endereco').value;
        const numero = document.getElementById('numero').value;
        const cep = document.getElementById('cep').value;
        const cidade = document.getElementById('cidade').value;

        // Validar os campos com regex
        const dataNascimentoRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        const cepRegex = /^\d{5}-\d{3}$/;

        // validações
        if (!dataNascimentoRegex.test(dataNascimento)) {
            errorMessage = 'Data de nascimento inválida. Use o formato dd/mm/aaaa.';
            document.getElementById('dataNascimento').addEventListener('focus', function () {
                alertDiv.classList.add('visually-hidden');
            });
        } else if (!cepRegex.test(cep)) {
            errorMessage = 'CEP inválido. Use o formato 12345-000.';
            document.getElementById('cep').addEventListener('focus', function () {
                alertDiv.classList.add('visually-hidden');
            });
        }

        // Se houver mensagem de erro, exibi-la no alerta
        if (errorMessage) {
            alertDiv.classList.remove('visually-hidden');
            alertDiv.textContent = errorMessage;

            // Ocultar a mensagem de erro após 5 segundos
            setTimeout(function () {
                alertDiv.classList.add('visually-hidden');
            }, 5000);

            return;
        }

        // Lógica para o botão "Cadastrar"
        if (buttonClicked.id === 'cadastrarBtn') {
            // Gerar um ID único para o novo cliente
            const id = Date.now().toString();

            // Criar um objeto com os dados do cliente
            const cliente = {
                id,
                nome,
                sobrenome,
                dataNascimento,
                tipoCliente,
                endereco,
                numero,
                cep,
                cidade
            };
    
            // Obter a lista de clientes do localStorage se existir
            let listaClientes = JSON.parse(localStorage.getItem('clientes')) || [];
    
            // Adicionar o novo cliente à lista
            listaClientes.push(cliente);
    
            // Salvar a lista atualizada no localStorage
            localStorage.setItem('clientes', JSON.stringify(listaClientes));
    
            // Limpar os campos do formulário após adicionar o cliente
            form.reset();

            // Lista os clientes no console
            console.log(listaClientes);
        }
        // Lógica para o botão "Limpar"
        else if (buttonClicked.id === 'limparBtn') {
            limparInputs();
        }
        // Lógica para o botão "Listar"
        else if (buttonClicked.id === 'listarBtn') {
            window.location.href = "table.html";
        }
    });

    // Adiciona um ouvinte de evento de clique ao botão
    listarBtn.addEventListener("click", function () {
        // Redireciona o usuário para a pagina table
        window.location.href = "table.html";
    });
    limparBtn.addEventListener('click', () => {
        limparInputs();
    });

    // Chama a função para preencher os campos ao carregar a página
    preencherCamposEdicao();


    /* FUNÇÕES */

    // Função para preencher os campos ao carregar a página
    function preencherCamposEdicao() {
        // Recupera os dados do cliente do localStorage
        const clienteParaEditar = JSON.parse(localStorage.getItem('clienteParaEditar'));

        // Se existirem dados, preenche os campos do formulário
        if (clienteParaEditar) {
            document.getElementById('nome').value = clienteParaEditar.nome;
            document.getElementById('sobrenome').value = clienteParaEditar.sobrenome;
            document.getElementById('dataNascimento').value = clienteParaEditar.dataNascimento;
            document.getElementById('tipoCliente').value = clienteParaEditar.tipoCliente;
            document.getElementById('endereco').value = clienteParaEditar.endereco;
            document.getElementById('numero').value = clienteParaEditar.numero;
            document.getElementById('cep').value = clienteParaEditar.cep;
            document.getElementById('cidade').value = clienteParaEditar.cidade;
        }

        // Limpa os dados do cliente do localStorage
        localStorage.removeItem('clienteParaEditar');
    }

    // Arrow Function para limpar todos os inputs
    const limparInputs = () => {
        document.getElementById('nome').value = '';
        document.getElementById('sobrenome').value = '';
        document.getElementById('dataNascimento').value = '';
        document.getElementById('tipoCliente').selectedIndex = 0; // Define a opção padrão
        document.getElementById('endereco').value = '';
        document.getElementById('numero').value = '';
        document.getElementById('cep').value = '';
        document.getElementById('cidade').value = '';
    };


    /* API */

    // Chamada de API para buscar endereço pelo CEP usando fetch
    document.getElementById('cep').addEventListener('input', function () {
        const cep = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos do CEP
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('endereco').value = data.logradouro;
                        document.getElementById('cidade').value = data.localidade;
                        // Você também pode preencher outros campos, como estado, com os dados da API
                    } else {
                        alertDiv.classList.remove('visually-hidden');
                        alertDiv.textContent = 'CEP não encontrado';

                        // Ocultar a mensagem de erro após 5 segundos
                        setTimeout(function () {
                            alertDiv.classList.add('visually-hidden');
                        }, 5000);
                    }
                })
                .catch(error => console.error(error));
        }
    });
});
