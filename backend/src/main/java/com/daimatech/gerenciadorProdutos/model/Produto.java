package com.daimatech.gerenciadorProdutos.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.math.BigDecimal;

@Entity
public class Produto {
    @Id
    private String codigo;
    private String nome;
    private Double preco;
    private Integer quantidadeEstoque;

    // esse construtor vazio é necessário para JPA
    public Produto(){}

    public Produto(String codigo, String nome, Double preco, Integer quantidadeEstoque) {
        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return this.nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Double getPreco() {
        return this.preco;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }

    public Integer getQuantidadeEstoque() {
        return this.quantidadeEstoque;
    }

    public void setQuantidadeEstoque(Integer quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public Double calcularValorDeEstoque(){
        return getPreco()*getQuantidadeEstoque();
    }

    @Override
    public String toString() {
        return "Produto{" +
                "Codigo=" + this.codigo +
                ", nome='" + this.nome + '\'' +
                ", preco=" + this.preco +
                ", quantida de Estoque=" + this.quantidadeEstoque +
                ", Valor de estoque=" + calcularValorDeEstoque() +
                '}';
    }

    public void atualizarQuantidade(int novaQuantidade) {
    }
}
