package com.beee.Controller.AdminController;

import com.beee.Common.Constants;
import com.beee.Common.Utils;
import com.beee.Model.CategoryModel;
import com.beee.Repository.CategoryRepo;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/categories")
public class CategoryAdminController {
	private final CategoryRepo categoryRepo;

	public CategoryAdminController(CategoryRepo categoryRepo) {
		this.categoryRepo = categoryRepo;
	}

	@PostMapping
	public ResponseEntity addCategory(@RequestBody CategoryModel category) {
		if (category.getName() == null || category.getName().isEmpty()) {
			return ResponseEntity.badRequest().body("Nhập đầy đủ giá trị");
		}
		String categoryName = category.getName().trim();
		if (category.getId() != null) {
			CategoryModel modifier = categoryRepo.findCategoryModelById(category.getId());
			if (!categoryName.equalsIgnoreCase(modifier.getName()) && categoryRepo.existsByName(categoryName)) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Tên đã tồn tại");
			}
		} else if (categoryRepo.existsByName(categoryName)) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Tên đã tồn tại");
		}
		return new ResponseEntity(categoryRepo.save(category), HttpStatus.OK);
	}

	@DeleteMapping
	public ResponseEntity deleteCategories(@RequestBody Map<String, Object> params) {
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
		if (errors.size() > 0) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(Utils.mapOfResponse(Constants.RESULT_FAIL, "failed", errors));
		}
		return ResponseEntity.ok().build();
	}

}
