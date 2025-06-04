package com.beee.Controller;

import com.beee.Common.Utils;
import com.beee.Repository.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.ParsingUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
	public ResponseEntity getCategories(@RequestParam Map<String, String> params) {
		String sort = params.getOrDefault("sort", "name");
		sort = ParsingUtils.reconcatenateCamelCase(sort, "_");
		boolean descending = Boolean.parseBoolean(params.getOrDefault("descending", "true"));
		String keyword = params.getOrDefault("keyword", " ");
		List lst = new ArrayList();
		for (ArrayList<String> category : categoryRepo.getCategoriesAndCourseCount(keyword, Utils.setSort(sort, descending))) {
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

