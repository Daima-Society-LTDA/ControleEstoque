package com.daimatech.gerenciadorProdutos.controller;

import com.daimatech.gerenciadorProdutos.repository.ProdutoRepository;
import com.daimatech.gerenciadorProdutos.model.Produto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/produtos")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class ProdutoController {
    @Autowired
    private ProdutoRepository produtoRepository;

    // Endpoint para LISTAR todos os produtos
    @GetMapping
    public List<Produto> getAllProdutos() {
        return produtoRepository.findAll();
    }

    // Endpoint para OBTER um produto por ID
    @GetMapping("/{codigo}")
    public ResponseEntity<Produto> getProdutoById(@PathVariable String codigo) {
        Optional<Produto> produto = produtoRepository.findById(codigo);
        return produto.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Adicionar produto (POST)
    @PostMapping("/adicionar")
    @ResponseStatus(HttpStatus.CREATED)
    public Produto adicionarProduto(@RequestBody Produto produto) {
        if (produtoRepository.existsById(produto.getCodigo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Produto com o código " + produto.getCodigo() + " já existe.");
        }
        return produtoRepository.save(produto);
    }

    @DeleteMapping("/deletar/{codigo}")
    public ResponseEntity<Void> removerProdutoByCodigo(@PathVariable String codigo) {
        // Primeiro, verificamos se o produto com esse código existe
        Optional<Produto> produtoOptional = Optional.ofNullable(produtoRepository.findByCodigo(codigo));

        if (produtoOptional.isPresent()) {
            // Se o produto existir, nós o deletamos usando o novo método do repositório
            produtoRepository.deleteByCodigo(codigo);
            // Retorna um status 204 No Content, que indica sucesso na deleção sem conteúdo para retornar
            return ResponseEntity.noContent().build();
        } else {
            // Se o produto não for encontrado, retorna um status 404 Not Found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Endpoint para ATUALIZAR um produto (PUT)
    // CORRIGIDO: Removido "/atualizar-estoque" para alinhar com o frontend.
    @PutMapping("/atualizar-estoque/{codigo}") // A URL correta será /api/produtos/{codigo}
    public ResponseEntity<Produto> updateProduto(@PathVariable String codigo, @RequestBody Produto produtoAtualizado) {
        Optional<Produto> produtoExistente = produtoRepository.findById(codigo);

        if (produtoExistente.isPresent()) {
            Produto produto = produtoExistente.get();

            // Atualiza os campos que podem ser modificados.
            // Para a quantidade de estoque, vamos focar nela.
            produto.setNome(produtoAtualizado.getNome() != null ? produtoAtualizado.getNome() : produto.getNome());
            produto.setPreco(produtoAtualizado.getPreco() != null ? produtoAtualizado.getPreco() : produto.getPreco());
            produto.setQuantidadeEstoque(produtoAtualizado.getQuantidadeEstoque());

            Produto produtoSalvo = produtoRepository.save(produto);
            return ResponseEntity.ok(produtoSalvo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}