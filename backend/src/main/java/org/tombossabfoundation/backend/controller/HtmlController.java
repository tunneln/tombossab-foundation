package org.tombossabfoundation.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class HtmlController {

    // Logger logger = LoggerFactory.getLogger(HelloController.class);

    private static final String COFFEE_WOMEN_EMPOWERMENT_EVENT = "/events/coffee-women-empowerment-1";

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

    @RequestMapping("/coffee-women-empowerment")
    public RedirectView redirectCoffeeWomenEmpowerment() {
        return permanentRedirect(COFFEE_WOMEN_EMPOWERMENT_EVENT);
    }

    @RequestMapping("/events-detail")
    public RedirectView redirectEventsDetail() {
        return permanentRedirect(COFFEE_WOMEN_EMPOWERMENT_EVENT);
    }

    private RedirectView permanentRedirect(String url) {
        RedirectView redirectView = new RedirectView(url);
        redirectView.setStatusCode(HttpStatus.MOVED_PERMANENTLY);
        return redirectView;
    }

}
