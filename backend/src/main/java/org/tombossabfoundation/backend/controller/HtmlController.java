package org.tombossabfoundation.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HtmlController {

    // Logger logger = LoggerFactory.getLogger(HelloController.class);

    @RequestMapping("/{page:^(?!.*[.].*$).*$}")
    public String requestPage(@PathVariable("page") String page) {
        String htmlPage = "/"+page+".html";
        // logger.info("forwarding request to {}", htmlPage);
        return htmlPage;
    }
        
}