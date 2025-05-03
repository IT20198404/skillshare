package com.skillshare.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootRedirectController {

    @GetMapping("/")
    public String redirectToFrontend() {
        return "redirect:http://localhost:3000";
    }
}
