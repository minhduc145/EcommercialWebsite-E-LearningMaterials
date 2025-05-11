package com.beee.ExceptionHandler;

import com.beee.Common.Constants;
import com.beee.Common.Utils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map> handleValidationExceptions(MethodArgumentNotValidException ex) {
		Map<String, Object> errors = new HashMap<>();
		errors.put("result", Constants.RESULT_FAIL);
		ex.getBindingResult().getFieldErrors().forEach(error -> {
			errors.put(error.getField(), error.getDefaultMessage());
		});
		return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
	}
	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity handleMaxSizeException(MaxUploadSizeExceededException e) {
		return ResponseEntity
				.badRequest()
				.body(Utils.mapOfResponse(Constants.RESULT_FAIL, "failed",e.getMessage()));
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity handleIllegalArgument(IllegalArgumentException e) {
		e.printStackTrace();
		return ResponseEntity
				.badRequest()
				.body(Utils.mapOfResponse(Constants.RESULT_FAIL, "failed",e.getMessage()));
	}

}
