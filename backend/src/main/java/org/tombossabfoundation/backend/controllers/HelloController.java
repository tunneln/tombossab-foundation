package org.tombossabfoundation.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
public class HelloController {
    
    @GetMapping("/api/hello") 
    public String sayHello() {
        return "Hello, World. The time is " + new Date();
    }

    @GetMapping(value = "/{path:^(?!api).*}")
    public String forwardToReact() {
        return "forward:/";
    }
}
