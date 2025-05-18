package com.beee.Service;

import com.beee.Common.Constants;
import com.beee.Config.RabbitMQConfig;
import com.beee.Model.CourseFileModel;
import com.beee.Model.MessageModel;
import com.beee.Model.UserModel;
import com.beee.Repository.MessageRepo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RabbitMQConsumer {
	@Autowired
	SimpMessagingTemplate template;
	ObjectMapper objectMapper = new ObjectMapper();
	@Autowired
	private QueueService queueService;
	@Autowired
	private MessageRepo messageRepo;

	//notification
	@RabbitListener(queues = "queue1")
	public void convertToWebSocketQ1(Map map) {
		String message = (String) map.get("message");
		String title = (String) map.get("title");
		String senderId = (String) map.get("senderId");
		MessageModel messageModel = MessageModel.builder().title(title).message(message).sender(UserModel.builder().id(senderId).build()).build();
		if ((Boolean) map.getOrDefault("isForEveryone", "false") == true) {
			messageModel.setIsForEveryone(true);
			messageRepo.save(messageModel);
			template.convertAndSend("/topic/receive", title);
		} else {
			List<String> ids = (ArrayList<String>) map.get("id");
			for (String id : ids) {
				messageModel.setIsForEveryone(false);
				messageModel.setReceiver(UserModel.builder().id(id).build());
				messageRepo.save(messageModel);
				template.convertAndSend("/topic/receive/" + id, title);
			}
		}
		System.out.println("Received-1: " + map);
	}

	//payment
	@RabbitListener(queues = RabbitMQConfig.QUEUE2)
	public void convertToWebSocketQ2(Map map) {
		try {
			String username = (String) map.get("username");
			String message = (String) map.get("message");
			template.convertAndSend("/topic/result/" + username, message);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("Received-2: " + map);
	}

	//file-process
	@RabbitListener(queues = RabbitMQConfig.FILE_PROCESS_QUEUE, concurrency = "3")
	public void convertToWebSocketFileProcessQueue(Map map) {
		String cmd = objectMapper.convertValue(map.get("command"), String.class);
		if (cmd.equals(Constants.QUEUE_FILE_COMMAND_PROCESS)) {
			CourseFileModel file = objectMapper.convertValue(map.get("fileModel"), CourseFileModel.class);
			try {
				queueService.processFileQueue(file.getId());
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
