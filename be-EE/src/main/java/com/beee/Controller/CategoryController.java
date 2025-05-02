package com.beee.Controller;

import com.beee.Model.CategoryModel;
import com.beee.Repository.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
	@Autowired
	CategoryRepo categoryRepo;

	@GetMapping
	public ResponseEntity getCategories() {
		List lst = new ArrayList();
		for (ArrayList<String> category : categoryRepo.getCategoriesAndCourseCount()) {
			Map map = new HashMap();
			map.put("id", category.get(0));
			map.put("name", category.get(1));
			map.put("description", category.get(2));
			map.put("courseCount", category.get(3));
			lst.add(map);
		}
		return ResponseEntity.ok(lst);
	}
}
