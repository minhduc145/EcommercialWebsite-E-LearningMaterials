package com.beee.DTO;

import com.beee.Model.CourseReviewModel;
import lombok.*;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SubscriptionTabSummaryDTO {
	private boolean isSubscribed;
	private Timestamp subscribedAt;
	private boolean isFavourite;
	private CourseReviewModel review;
	private Boolean isSubsAvailable;
}
