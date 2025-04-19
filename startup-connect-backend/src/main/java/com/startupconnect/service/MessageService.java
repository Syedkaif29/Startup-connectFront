package com.startupconnect.service;

import com.startupconnect.model.Message;
import com.startupconnect.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private com.startupconnect.repository.UserRepository userRepository;

    public Message sendMessage(Long senderId, Long receiverId, String content) {
        System.out.println("[MessageService] sendMessage called with senderId=" + senderId + ", receiverId=" + receiverId + ", content=" + content);
        try {
            Message msg = new Message();
            msg.setSenderId(senderId);
            msg.setReceiverId(receiverId);
            msg.setContent(content);
            msg.setTimestamp(LocalDateTime.now());
            Message saved = messageRepository.save(msg);
            System.out.println("[MessageService] Message saved with id=" + saved.getId());
            return saved;
        } catch (Exception e) {
            System.err.println("[MessageService] Error saving message: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public List<Message> getConversation(Long user1, Long user2) {
        return messageRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByTimestampAsc(
                user1, user2, user1, user2
        );
    }

    public java.util.List<com.startupconnect.model.User> getConversationUsers(Long userId) {
        java.util.List<Message> messages = messageRepository.findAll();
        java.util.Set<Long> userIds = new java.util.HashSet<>();
        for (Message m : messages) {
            if (m.getSenderId().equals(userId)) {
                userIds.add(m.getReceiverId());
            } else if (m.getReceiverId().equals(userId)) {
                userIds.add(m.getSenderId());
            }
        }
        if (userIds.isEmpty()) return java.util.Collections.emptyList();
        return userRepository.findAllById(userIds);
    }
}
