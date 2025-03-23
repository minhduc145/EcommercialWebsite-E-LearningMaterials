package mySpringBoot.sp1.Controller;

import mySpringBoot.sp1.Model.User;
import mySpringBoot.sp1.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Users")
public class UserController {
    @Autowired
    private UserRepo userRepo;

    @GetMapping
    public List<User> findAll() {
        return userRepo.findAll();
    }

    @GetMapping("/{id}")
    public User findById(@PathVariable Long id) {
        return userRepo.findById(id).orElse(null);
    }

    @PutMapping(value = "/update", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public User update(@RequestBody User user) {
        return userRepo.save(user);
    }

    @PostMapping(value = "/add", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public User add(@ModelAttribute User user, Model model) {
        return userRepo.save(user);
    }

}
