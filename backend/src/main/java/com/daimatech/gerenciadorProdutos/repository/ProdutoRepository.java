package com.daimatech.gerenciadorProdutos.repository;

import com.daimatech.gerenciadorProdutos.model.Produto;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, String> {
    List<Produto> findByNomeContainingIgnoreCase(String nome);
    Produto findByCodigo(String codigo);

    @Query("SELECT p FROM Produto p ORDER BY p.nome ASC")
    List<Produto> listarOrdenadoPorNome();

    @Query("SELECT p FROM Produto p ORDER BY p.preco DESC")
    List<Produto> listarOrdenadoPorPreco();

    @Query(value = "SELECT SUM(quantidade_estoque * preco) FROM produto", nativeQuery = true)
    Double calcularValorTotalEstoque();

    @Transactional
    void deleteByCodigo(String codigo);
}
