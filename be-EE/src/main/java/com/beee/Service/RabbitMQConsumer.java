package com.beee.Service;

import com.beee.Common.Constants;
import com.beee.Config.RabbitMQConfig;
import com.beee.Model.CourseContainerModel;
import com.beee.Model.CourseFileModel;
import com.beee.Model.CourseModel;
import com.beee.Repository.CourseFileRepo;
import com.beee.Repository.CourseRepo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class RabbitMQConsumer {
	@Autowired
	SimpMessagingTemplate template;
	ObjectMapper objectMapper = new ObjectMapper();
	@Autowired
	private CourseFileRepo courseFileRepo;
	@Autowired
	private CourseRepo courseRepo;
	@Autowired
	private QueueService queueService;

	//notification
	@RabbitListener(queues = "queue1")
	public void convertToWebSocketQ1(String json) {
		try {
			Map<String, Object> map = objectMapper.readValue(json, new TypeReference<>() {
			});
			String username = (String) map.get("username");
			String message = (String) map.get("message");
			template.convertAndSend("/topic/receive/" + username, message);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("Received-1: " + json);
	}

	//payment
	@RabbitListener(queues = RabbitMQConfig.QUEUE2)
	public void convertToWebSocketQ2(String json) {
		try {
			Map<String, Object> map = objectMapper.readValue(json, new TypeReference<>() {
			});
			String username = (String) map.get("username");
			String message = (String) map.get("message");
			template.convertAndSend("/topic/result/" + username, message);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("Received-2: " + json);
	}

	//file-process
	@RabbitListener(queues = RabbitMQConfig.FILE_PROCESS_QUEUE, concurrency = "3")
	public void convertToWebSocketFileProcessQueue(Map map) {
		String cmd = objectMapper.convertValue(map.get("command"), String.class);
		if (cmd.equals("process")) {
			CourseFileModel file = objectMapper.convertValue(map.get("fileModel"), CourseFileModel.class);
			String containerId = objectMapper.convertValue(map.get("containerId"), String.class);
			CourseModel courseModel = null;
			try {
				queueService.processFileQueue(file, courseModel, containerId);
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				if (file != null) {
					file.setContainer(CourseContainerModel.builder().id(UUID.fromString(containerId)).build());
					courseFileRepo.save(file);
				}
				if (courseModel != null) {
					courseModel.setStatus(Constants.FILE_STATUS_DONE);
					courseRepo.save(courseModel);
				}
			}
		} else if (cmd.equals("delete")) {
			String prefix = objectMapper.convertValue(map.get("prefix"), String.class);
			queueService.deleteFileQueue(prefix);
		}
		System.out.println("Received-3: " + map);
	}

}
