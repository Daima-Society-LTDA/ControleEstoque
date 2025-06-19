// --- Variáveis globais para gerenciar o estado do produto na página de detalhes ---
let currentProductData = null;

// --- Funções para interagir com a API de Produtos ---

/**
 * Carrega e exibe a lista completa de produtos na tela.
 * Adiciona um botão de "Deletar" para cada produto.
 */
function consultarProdutos() {
    fetch("http://localhost:8080/api/produtos")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar produtos");
            }
            return response.json();
        })
        .then(produtos => {
            const lista = document.getElementById("lista-produtos");
            if (!lista) {
                console.error("Elemento 'lista-produtos' não encontrado no DOM.");
                return;
            }
            lista.innerHTML = ""; // Limpa a lista antes de preencher

            if (produtos.length === 0) {
                lista.innerHTML = "<li>Nenhum produto cadastrado.</li>";
                return;
            }

            produtos.forEach(produto => {
                const item = document.createElement("li");

                // Texto do item do produto
                const textoProduto = `Código: ${produto.codigo} | Nome: ${produto.nome}, Quantidade: ${produto.quantidadeEstoque}, Preço: R$${produto.preco.toFixed(2)}`;
                item.appendChild(document.createTextNode(textoProduto));

                // Configura o evento de clique para redirecionar para os detalhes do produto
                item.addEventListener("click", function(event) {
                    // Impede que o clique no LI seja acionado se o clique for no botão de deletar
                    if (event.target.tagName === 'BUTTON') {
                        return;
                    }
                    buscarProdutoDetalhes(produto.codigo);
                });

                // Botão de deletar
                const botaoDeletar = document.createElement("button");
                botaoDeletar.textContent = "Deletar";
                botaoDeletar.className = "button is-danger is-small ml-3"; // Bulma classes
                botaoDeletar.onclick = (event) => {
                    event.stopPropagation(); // Impede que o clique no botão ative o clique do LI
                    deletarProdutoByCodigo(produto.codigo);
                };

                item.appendChild(botaoDeletar);
                lista.appendChild(item);
            });
        })
        .catch(error => {
            alert("Erro ao consultar produtos: " + error.message);
            console.error("Erro ao consultar produtos:", error);
        });
}

/**
 * Esconde a lista de produtos, limpando os itens da visualização.
 */
function esconderProdutos() {
    const listaProdutos = document.querySelector("#lista-produtos");
    if (listaProdutos) {
        while (listaProdutos.firstChild) {
            listaProdutos.removeChild(listaProdutos.firstChild);
        }
        console.log("Produtos removidos da visualização.");
    } else {
        console.warn("Elemento #lista-produtos não encontrado no DOM.");
    }
}

/**
 * Redireciona para a página de detalhes de um produto, passando o código na URL.
 * Usado para buscar individualmente e ao clicar em um item da lista.
 * @param {string} cd_produto - O código do produto a ser buscado.
 */
function buscarProdutoDetalhes(cd_produto) {
    if (!cd_produto || cd_produto.trim() === "") {
        alert("Por favor, digite um código de produto para buscar.");
        return;
    }
    window.location.href = `produto.html?codigo=${encodeURIComponent(cd_produto)}`;
}

/**
 * Função chamada pelo campo de busca na página principal (index.html).
 * Obtém o valor do input e chama `buscarProdutoDetalhes`.
 */
function buscarProduto() {
    let cd_produto = document.querySelector("#input-buscaProduto").value;
    buscarProdutoDetalhes(cd_produto); // Chama a função que redireciona
}

/**
 * Deleta um produto do banco de dados usando seu código.
 * Após a deleção, recarrega a lista de produtos na página atual (index.html).
 * @param {string} codigoProduto - O código do produto a ser deletado.
 */
function deletarProdutoByCodigo(codigoProduto) {
    if (confirm(`Tem certeza que deseja deletar o produto com código "${codigoProduto}"?`)) {
        fetch(`http://localhost:8080/api/produtos/deletar/${codigoProduto}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Produto não encontrado para deleção.");
                }
                throw new Error("Erro ao deletar produto: " + response.statusText);
            }
            alert(`Produto com código "${codigoProduto}" deletado com sucesso!`);
            // Se estiver no index.html, recarrega a lista
            if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
                 consultarProdutos();
            } else {
                // Se estiver em outra página, pode redirecionar para o index ou fazer outra ação.
                // Para simplificar, vou manter a lógica de redirecionar se o contexto for 'produto.html'
                // (a função deletarProdutoEVoltar lida com isso na página de detalhes).
                console.log("Deletado, mas não recarregou lista porque não está no index.");
            }
        })
        .catch(error => {
            alert("Erro ao deletar: " + error.message);
            console.error("Erro ao deletar produto:", error);
        });
    }
}

/**
 * Envia os dados de um novo produto para o backend para cadastro.
 * Esta função é tipicamente chamada por um formulário de cadastro.
 * @param {Object} produto - Objeto contendo os dados do produto (codigo, nome, preco, quantidadeEstoque).
 */
function cadastrarProduto(produto) {
    return fetch('http://localhost:8080/api/produtos/adicionar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
    .then(response => {
        console.log("Resposta do servidor:", response);
        if (!response.ok) {
            return response.json()
                .catch(() => {
                    throw new Error(`Erro ${response.status}: ${response.statusText || 'Erro desconhecido do servidor.'}`);
                })
                .then(errorData => {
                    if (response.status === 409) {
                        throw new Error(errorData.message || 'Erro: Código de produto já existente.');
                    }
                    throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText || 'Erro desconhecido.'}`);
                });
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        } else {
            console.warn("Resposta OK, mas não é JSON:", response);
            return {};
        }
    });
}

// --- Funções Específicas para a Página de Detalhes (produto.html) ---

/**
 * Deleta um produto do banco de dados e redireciona para a página inicial.
 * Usado exclusivamente na página de detalhes do produto.
 * @param {string} codigoProduto - O código do produto a ser deletado.
 */
function deletarProdutoEVoltar(codigoProduto) {
    if (confirm(`Tem certeza que deseja deletar o produto com código "${codigoProduto}"?`)) {
        fetch(`http://localhost:8080/api/produtos/deletar/${codigoProduto}`, { // Seu endpoint DELETE
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Produto não encontrado para deleção.");
                }
                throw new Error("Erro ao deletar produto: " + response.statusText);
            }
            alert(`Produto com código "${codigoProduto}" deletado com sucesso!`);
            window.location.href = 'index.html'; // Redireciona de volta para o index
        })
        .catch(error => {
            alert("Erro ao deletar: " + error.message);
            console.error("Erro ao deletar produto:", error);
        });
    }
}

/**
 * Carrega e exibe os detalhes de um produto específico na página `produto.html`.
 * Também configura o formulário de atualização de estoque.
 */
function loadAndDisplayProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const codigoProduto = urlParams.get('codigo');
    const detalhesDiv = document.getElementById('produto-detalhes');
    const updateFormSection = document.getElementById('update-form-section');
    const novaQuantidadeInput = document.getElementById('novaQuantidadeEstoque');
    const btnAtualizarEstoque = document.getElementById('btnAtualizarEstoque');
    const updateMessageDiv = document.getElementById('updateMessage');

    if (codigoProduto) {
        fetch(`http://localhost:8080/api/produtos/${codigoProduto}`)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Produto não encontrado.");
                    }
                    throw new Error("Erro ao buscar detalhes do produto: " + response.statusText);
                }
                return response.json();
            })
            .then(produto => {
                if (produto) {
                    currentProductData = produto; // Armazena os dados do produto atual
                    detalhesDiv.innerHTML = `
                        <p><strong>Código:</strong> ${produto.codigo}</p>
                        <p><strong>Nome:</strong> ${produto.nome}</p>
                        <p><strong>Preço:</strong> R$${produto.preco.toFixed(2)}</p>
                        <p><strong>Quantidade em Estoque:</strong> <span id="currentQuantidade">${produto.quantidadeEstoque}</span></p>
                        <p><strong>Valor Total em Estoque:</strong> R$${(produto.preco * produto.quantidadeEstoque).toFixed(2)}</p>
                        <div class="has-text-centered mt-4">
                            <button class="button is-danger is-large" onclick="deletarProdutoEVoltar('${produto.codigo}')">Deletar Produto</button>
                        </div>
                    `;
                    updateFormSection.style.display = 'block'; // Exibe a seção de atualização
                    novaQuantidadeInput.value = produto.quantidadeEstoque;
                } else {
                    detalhesDiv.innerHTML = `<p class="has-text-danger has-text-centered">Produto não encontrado.</p>`;
                    updateFormSection.style.display = 'none';
                }
            })
            .catch(error => {
                detalhesDiv.innerHTML = `<p class="has-text-danger has-text-centered">Erro: ${error.message}</p>`;
                updateFormSection.style.display = 'none';
                console.error('Erro ao carregar detalhes do produto:', error);
            });
    } else {
        detalhesDiv.innerHTML = `<p class="has-text-danger has-text-centered">Nenhum código de produto fornecido na URL.</p>`;
        updateFormSection.style.display = 'none';
    }

    // Adiciona o event listener para o botão de atualização do estoque
    btnAtualizarEstoque.addEventListener('click', function() {
        const novaQuantidade = parseInt(novaQuantidadeInput.value, 10);

        if (isNaN(novaQuantidade) || novaQuantidade < 0) {
            updateMessageDiv.textContent = 'Por favor, insira uma quantidade válida (número não negativo).';
            updateMessageDiv.className = 'help is-danger';
            return;
        }

        if (!currentProductData) {
            updateMessageDiv.textContent = 'Erro: Dados do produto não carregados.';
            updateMessageDiv.className = 'help is-danger';
            return;
        }

        // Cria um objeto Produto com os dados atuais e a nova quantidade
        const produtoParaAtualizar = {
            codigo: currentProductData.codigo,
            nome: currentProductData.nome,
            preco: currentProductData.preco,
            quantidadeEstoque: novaQuantidade
        };

        // Usa o endpoint PUT correto (que agora é /api/produtos/{codigo})
        fetch(`http://localhost:8080/api/produtos/atualizar-estoque/${currentProductData.codigo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produtoParaAtualizar)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao atualizar estoque: " + response.statusText);
            }
            return response.json();
        })
        .then(updatedProduct => {
            updateMessageDiv.textContent = `Estoque atualizado com sucesso! Nova quantidade: ${updatedProduct.quantidadeEstoque}`;
            updateMessageDiv.className = 'help is-success';
            // Atualiza a quantidade exibida na página
            document.getElementById('currentQuantidade').textContent = updatedProduct.quantidadeEstoque;
            // Atualiza o valor total em estoque
            const valorTotal = (updatedProduct.preco * updatedProduct.quantidadeEstoque).toFixed(2);
            document.querySelector('#produto-detalhes p:nth-child(5)').innerHTML = `<strong>Valor Total em Estoque:</strong> R$${valorTotal}`;
            currentProductData = updatedProduct; // Atualiza os dados locais
        })
        .catch(error => {
            updateMessageDiv.textContent = `Erro: ${error.message}`;
            updateMessageDiv.className = 'help is-danger';
            console.error('Erro ao atualizar estoque:', error);
        });
    });
}