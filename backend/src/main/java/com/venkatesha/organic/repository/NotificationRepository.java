package com.venkatesha.organic.repository;

import com.venkatesha.organic.entity.Notification;
import com.venkatesha.organic.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId OR n.user IS NULL ORDER BY n.createdAt DESC")
    List<Notification> findCustomerNotifications(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE n.user.role = :role OR n.user IS NULL ORDER BY n.createdAt DESC")
    List<Notification> findByRoleNotifications(@Param("role") Role role);

    long countByUserIdAndReadFalse(Long userId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE (n.user.role = 'ROLE_OWNER' OR n.user IS NULL) AND n.read = false")
    long countUnreadOwnerNotifications();
}
