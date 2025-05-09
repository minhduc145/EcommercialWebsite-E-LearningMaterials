package com.beee.Common;

import java.util.Set;

public class Constants {
	public static final Integer PAGEABLE_PAGE_SIZE = 5;

	public final static Integer RESULT_SUCCESS = 1;
	public final static Integer RESULT_FAIL = 0;

	public final static String FILE_STATUS_PROCESSING = "Đang xử lý file";
	public final static String FILE_STATUS_DONE = null;

	public final static String URL_FE_LOGIN_SUCCESS = "http://localhost:3000/User/Login?success";
	public final static String URL_FE_LOGIN_FAIL = "http://localhost:3000/User/Login?fail";
	public final static String URL_FE_LOGIN_DEFAULT = "http://localhost:3000/User/Login";
	public final static String URL_FE_LOGOUT_SUCCESS = "http://localhost:3000/";

	public final static String URL_FE_PAYMENT_SUCCESS = "http://localhost:3000/Payment/Finished?success";
	public final static String URL_FE_PAYMENT_FAIL = "http://localhost:3000/Payment/Finished?fail";


	public final static String ROLE_ADMIN = "ADMIN";
	public final static String ROLE_USER = "USER";

	public final static String CLOUD_BUCKET_NAME = "ee-learning-01";
	public final static String CLOUD_URL_PUBLIC = "https://pub-e96712ffb5c644eab6d6682c1ebe8bf3.r2.dev";
	public final static Set<String> DOCUMENT_TYPES = Set.of(
			"application/msword",                  // .doc
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
			"application/pdf",                     // .pdf
			"text/plain",                          // .txt
			"application/xml",                     // .xml
			"application/vnd.ms-excel",            // .xls
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
	);
	public final static Set<String> SCORM_TYPES = Set.of("application/zip", "application/x-zip-compressed");


}
