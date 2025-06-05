package com.beee.Service;

import com.beee.Model.SubscriptionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface SubscriptionService {
	public boolean isSubscribedByUser(String username, SubscriptionModel subscriptionModel);

	public ResponseEntity isSubscribedByUserAndCourse(String userToken, String courseId);

	public ResponseEntity addReturnRequest(String userToken, Map<String, String> requestBody);
}
