document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('tbody');

    function atualizarTabela() {
        // Limpa a tabela
        tableBody.innerHTML = '';

        // Recupera a lista de clientes do localStorage (se existir)
        const listaClientes = JSON.parse(localStorage.getItem('clientes')) || [];

        // Itera sobre a lista de clientes e adiciona cada um à tabela
        listaClientes.forEach((cliente, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.dataNascimento}</td>
                <td>${cliente.endereco}, ${cliente.numero}</td>
                <td>${cliente.cidade}</td>
                <td>
                    <button class="btn btn-outline-primary" onclick="editarCliente(${index})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-outline-danger" onclick="excluirCliente(${index})"><i class="bi bi-trash"></i></button>
                </td>`;

            newRow.setAttribute('data-index', index); // Adiciona o índice como atributo
            tableBody.appendChild(newRow);
        });
    }

    // Função para excluir o cliente
    window.excluirCliente = function(id) {
        // Recupera a lista de clientes do localStorage (se existir)
        const listaClientes = JSON.parse(localStorage.getItem('clientes')) || [];

        // Remove o cliente da lista pelo índice
        listaClientes.splice(id, 1);

        // Salva a lista atualizada no localStorage
        localStorage.setItem('clientes', JSON.stringify(listaClientes));

        // Atualiza a tabela após a exclusão
        atualizarTabela();
    }

    window.editarCliente = function(id) {
        // Recupera a lista de clientes do localStorage
        const listaClientes = JSON.parse(localStorage.getItem('clientes')) || [];
    
        // Obtém o cliente pelo índice
        const clienteParaEditar = listaClientes[id]; 
    
        // Armazena os dados do cliente no localStorage
        localStorage.setItem('clienteParaEditar', JSON.stringify(clienteParaEditar));
    
        // Redireciona para a página index.html
        window.location.href = "index.html";
    }

    // Atualiza a tabela ao carregar a página
    atualizarTabela();

    window.retornar = function() {
        // Redireciona para a página index.html
        window.location.href = "index.html";
    }
});