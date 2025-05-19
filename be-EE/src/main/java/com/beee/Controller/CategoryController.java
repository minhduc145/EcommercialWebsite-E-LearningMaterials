package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Common.Utils;
import com.beee.Model.CategoryModel;
import com.beee.Repository.CategoryRepo;
import com.beee.Service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.util.ParsingUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
	@Autowired
	CategoryRepo categoryRepo;
	@Autowired
	private AccountService accountService;

	@GetMapping
	public ResponseEntity getCategories(@CookieValue(name = "jwt") String userToken, @RequestParam Map<String, String> params) {
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

	@PostMapping
	public ResponseEntity addCategory(@CookieValue(name = "jwt") String userToken, @RequestBody CategoryModel category) {
		if(!accountService.isAdminJwtOk(userToken)) {
			return new ResponseEntity(HttpStatus.UNAUTHORIZED);
		}
		return new ResponseEntity(categoryRepo.save(category), HttpStatus.OK);
	}

	@DeleteMapping
	public ResponseEntity deleteCatgories(@CookieValue(name = "jwt") String userToken, @RequestBody Map<String, Object> params) {
		if (!accountService.isAdminJwtOk(userToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		List<String> errors = new ArrayList<>();
		if (params.get("id") != null) {
			List<String> ids = (ArrayList<String>) params.get("id");
			for (String id : ids) {
				try {
					categoryRepo.deleteById(Integer.parseInt(id));
				} catch (DataIntegrityViolationException e) {
					Throwable rootCause = e.getRootCause();
					if (rootCause instanceof SQLException sqlEx)
						if (sqlEx.getSQLState().equals("23503"))
							errors.add("Không thể xóa Danh mục id:" + id + " vì đang được sử dụng.");
					else errors.add(rootCause.getMessage());
				}
			}
		}
		if(errors.size() > 0) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(Utils.mapOfResponse(Constants.RESULT_FAIL,"failed",errors));
		}
		return ResponseEntity.ok().build();
	}
}
