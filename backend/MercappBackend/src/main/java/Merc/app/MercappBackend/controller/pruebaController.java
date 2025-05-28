package Merc.app.MercappBackend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class pruebaController {

    @RequestMapping("/prueba")
    public String prueba() {
        return "Prueba exitosa";
    }

}
