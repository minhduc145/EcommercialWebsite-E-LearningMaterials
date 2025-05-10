package com.beee.Service;

import com.beee.Common.Constants;
import com.beee.Config.RabbitMQConfig;
import com.beee.Model.CourseFileModel;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RabbitMQConsumer {
	@Autowired
	SimpMessagingTemplate template;
	ObjectMapper objectMapper = new ObjectMapper();
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
		if (cmd.equals(Constants.QUEUE_FILE_COMMAND_PROCESS)) {
			CourseFileModel file = objectMapper.convertValue(map.get("fileModel"), CourseFileModel.class);
			String containerId = objectMapper.convertValue(map.get("containerId"), String.class);
			try {
				queueService.processFileQueue(file, containerId);
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else if (cmd.equals(Constants.QUEUE_FILE_COMMAND_DELETE)) {
			try {
				String prefix = objectMapper.convertValue(map.get("prefix"), String.class);
				queueService.deleteFileQueue(prefix);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		System.out.println("Received-3: " + map);
	}

}
