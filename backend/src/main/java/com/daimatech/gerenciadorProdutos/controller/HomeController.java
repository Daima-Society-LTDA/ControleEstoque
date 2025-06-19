package com.daimatech.gerenciadorProdutos.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home(){
        return "<h1>Produtos api</h1><hr><br>" +
                "<a href='/api/produtos'>Base de dados</a>";
    }
}
