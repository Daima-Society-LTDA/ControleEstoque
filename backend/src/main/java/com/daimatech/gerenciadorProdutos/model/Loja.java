package com.daimatech.gerenciadorProdutos.model;

import com.daimatech.gerenciadorProdutos.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Loja {

    @Autowired
    private ProdutoRepository produtoRp;

    public void adicionarProduto(Produto produto) {
        produtoRp.save(produto);
    }

    public void removerProduto(String codigo) {
        produtoRp.deleteById(codigo);
    }

    public Produto buscarPorCodigo(String codigo) {
        return produtoRp.findByCodigo(codigo);
    }

    public List<Produto> buscarPorNome(String nome) {
        return produtoRp.findByNomeContainingIgnoreCase(nome);
    }

    public List<Produto> listarTodos() {
        return produtoRp.findAll();
    }

    public List<Produto> listarOrdenadoPorNome() {
        return produtoRp.listarOrdenadoPorNome();
    }

    public List<Produto> listarOrdenadoPorPreco() {
        return produtoRp.listarOrdenadoPorPreco();
    }

    public double calcularValorTotalEstoque() {
        return produtoRp.calcularValorTotalEstoque();
    }
}