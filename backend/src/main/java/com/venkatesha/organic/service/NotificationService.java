package com.venkatesha.organic.service;

import com.venkatesha.organic.dto.NotificationDto;
import com.venkatesha.organic.entity.Notification;
import com.venkatesha.organic.entity.NotificationType;
import com.venkatesha.organic.entity.Role;
import com.venkatesha.organic.entity.User;
import com.venkatesha.organic.exception.ResourceNotFoundException;
import com.venkatesha.organic.repository.NotificationRepository;
import com.venkatesha.organic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public NotificationDto createAndSendNotification(User recipient, String title, String message, NotificationType type, boolean isOwnerTarget) {
        log.info("Creating notification: title='{}', type='{}', ownerTarget={}", title, type, isOwnerTarget);

        Notification notification = Notification.builder()
                .user(recipient)
                .title(title)
                .message(message)
                .type(type)
                .read(false)
                .build();

        Notification saved = notificationRepository.save(notification);
        NotificationDto dto = mapToDto(saved);

        // Push real-time WebSocket notification
        try {
            if (isOwnerTarget) {
                log.info("Broadcasting real-time WebSocket notification to owner channel: /topic/notifications/owner");
                messagingTemplate.convertAndSend("/topic/notifications/owner", dto);
            } else if (recipient != null) {
                log.info("Broadcasting real-time WebSocket notification to customer channel: /topic/notifications/customer/{}", recipient.getId());
                messagingTemplate.convertAndSend("/topic/notifications/customer/" + recipient.getId(), dto);
            } else {
                log.info("Broadcasting real-time WebSocket notification to public channel: /topic/notifications/public");
                messagingTemplate.convertAndSend("/topic/notifications/public", dto);
            }
        } catch (Exception e) {
            log.error("Failed to push WebSocket notification: {}", e.getMessage());
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getNotificationsForUser(Long userId) {
        return notificationRepository.findCustomerNotifications(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getOwnerNotifications() {
        return notificationRepository.findByRoleNotifications(Role.ROLE_OWNER)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationDto markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));
        notification.setRead(true);
        return mapToDto(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsReadForUser(Long userId) {
        List<Notification> notifications = notificationRepository.findCustomerNotifications(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void markAllAsReadForOwner() {
        List<Notification> notifications = notificationRepository.findByRoleNotifications(Role.ROLE_OWNER);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    private NotificationDto mapToDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .userId(notification.getUser() != null ? notification.getUser().getId() : null)
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
