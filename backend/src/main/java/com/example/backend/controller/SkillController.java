package com.example.backend.controller;

import com.example.backend.model.Skill;
import com.example.backend.repository.SkillRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "http://localhost:5173")
public class SkillController {

    private final SkillRepository skillRepository;

    public SkillController(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @GetMapping
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @PostMapping
    public Skill addSkill(@RequestBody Skill skill) {
        return skillRepository.save(skill);
    }

    @PutMapping("/{id}")
    public Skill updateSkill(@PathVariable Long id, @RequestBody Skill updatedSkill) {
        Skill skill = skillRepository.findById(id).orElseThrow();

        skill.setName(updatedSkill.getName());
        skill.setProficiency(updatedSkill.getProficiency());
        skill.setGoal(updatedSkill.getGoal());
        skill.setTargetDate(updatedSkill.getTargetDate());
        skill.setProgress(updatedSkill.getProgress());

        return skillRepository.save(skill);
    }

    @DeleteMapping("/{id}")
    public void deleteSkill(@PathVariable Long id) {
        skillRepository.deleteById(id);
    }
}