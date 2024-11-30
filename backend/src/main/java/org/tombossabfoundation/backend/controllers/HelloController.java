package org.tombossabfoundation.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class HelloController {
   
    @RequestMapping(value = {"/", "/**/{path:[^\\.]*}"})
    public String index() {
        return "index.html";
    } 

    // @RequestMapping("/{path:[^\\.]+}/**")
    // public String forward() {
    //     return "forward:/index.html";
    // } 

    // @GetMapping(value = "/{path:^(?!api).*}")
    // public String requestPage(@PathVariable("page") String page) {
    //     String htmlPage = "/"+page;
    //     return htmlPage;
    // }
}
