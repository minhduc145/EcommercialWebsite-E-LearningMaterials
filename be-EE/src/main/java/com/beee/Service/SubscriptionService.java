package com.beee.Service;

import com.beee.Model.SubscriptionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface SubscriptionService {
	public boolean isSubscribedByUser(String username, SubscriptionModel subscriptionModel);

	public ResponseEntity isSubscribedByUserAndCourse(String userToken, String courseId);
}
