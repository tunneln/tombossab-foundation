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

    // Event sub-pages live under /events/<slug> (frontend pages/events/) and map
    // to the exported /events/<slug>.html. The single-segment mapping above
    // can't match a nested path, so event pages need their own mapping.
    @RequestMapping("/events/{page:^(?!.*[.].*$).*$}")
    public String requestEventPage(@PathVariable("page") String page) {
        return "/events/"+page+".html";
    }

}