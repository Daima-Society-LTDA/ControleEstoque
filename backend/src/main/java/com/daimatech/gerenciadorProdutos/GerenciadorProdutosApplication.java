package com.daimatech.gerenciadorProdutos;

import com.daimatech.gerenciadorProdutos.model.Loja;
import com.daimatech.gerenciadorProdutos.repository.ProdutoRepository;
import com.daimatech.gerenciadorProdutos.model.Produto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GerenciadorProdutosApplication implements CommandLineRunner {
	@Autowired // Injeta o repositório
	private ProdutoRepository produtoRepository;
    @Autowired
    private Loja loja;

	public static void main(String[] args) {
		SpringApplication.run(GerenciadorProdutosApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

        if (produtoRepository.count() == 0) {
            // Criar um novo produto
			Produto produto1 = new Produto();
            produto1.setCodigo("PROD-0001");
            produto1.setNome("Notebook Gamer");
            produto1.setPreco(7500.00); // Use BigDecimal para dinheiro!
            produto1.setQuantidadeEstoque(10);

            // Salvar o produto no banco de dados
            produtoRepository.save(produto1);
            System.out.println("Produto 'Notebook Gamer' adicionado com sucesso!");

            // Adicionar outro produto para exemplo
            Produto produto2 = new Produto();
            produto2.setCodigo("PROD-0002");
            produto2.setNome("Mouse Sem Fio");
            produto2.setPreco(120.50);
            produto2.setQuantidadeEstoque(50);

            produtoRepository.save(produto2);
            System.out.println("Produto 'Mouse Sem Fio' adicionado com sucesso!");

            loja.adicionarProduto(produto1);
            loja.adicionarProduto(produto2);

        } else {
            System.out.println("Já existem produtos no banco de dados. Pulando inserção de dados de teste.");
        }

        System.out.println("\n📦 Produtos no estoque:");
        loja.listarTodos().forEach(System.out::println);

        System.out.println("\n🔍 Buscar por nome 'teclado':");
        loja.buscarPorNome("Notebook Gamer").forEach(System.out::println);

        System.out.println("\n📊 Valor total do estoque: R$ " + loja.calcularValorTotalEstoque());

    }
}
