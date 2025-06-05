package com.beee.Common;

import java.util.Set;

public class Constants {
	public static final Integer PAGEABLE_PAGE_SIZE_5 = 5;
	public static final Integer PAGEABLE_PAGE_SIZE_7 = 7;
	public static final Integer PAGEABLE_PAGE_SIZE_10 = 10;


	public final static Integer RESULT_SUCCESS = 1;
	public final static Integer RESULT_FAIL = 0;

	public final static String QUEUE_FILE_COMMAND_PROCESS = "process";
	public final static String QUEUE_FILE_COMMAND_DELETE = "delete";

	public final static String REFUND_STATUS_PENDING = "pending";
	public final static String REFUND_STATUS_ACCEPTED = "accepted";
	public final static String REFUND_STATUS_DENIED = "denied";



	public final static String FILE_STATUS_PROCESSING = "Đang xử lý file";
	public final static String FILE_STATUS_DONE = null;

	public final static String PREFIX_BASE_UNZIPPED = "unzipped";
	public final static String PREFIX_BASE_HLS = "hls";
	public final static String HREF_HLS_INDEX = PREFIX_BASE_HLS + "/index.m3u8";


	public final static String URL_FE_LOGIN_SUCCESS = "http://localhost:3000/User/Login?success";
	public final static String URL_FE_LOGIN_FAIL = "http://localhost:3000/User/Login?fail";
	public final static String URL_FE_LOGIN_FAIL_LOCKED = URL_FE_LOGIN_FAIL + "&isLocked";
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

	public final static String addOrderByPriceDesc = "order by c.price desc";
	public final static String addOrderByTitleDesc = "order by c.title desc";
	public final static String addOrderByPriceAsc = "order by c.price asc";
	public final static String addOrderByTitleAsc = "order by c.title asc";

}
