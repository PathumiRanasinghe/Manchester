package com.university.dto;

import java.time.LocalDateTime;

public class AnnouncementDto {
    private Long id;
    private String title;
    private String content;
    private Long lecturerId;
    private Long departmentId;
    private LocalDateTime postedAt;

    public AnnouncementDto() {
    }

    public AnnouncementDto(Long id, String title, String content, Long lecturerId, Long departmentId, LocalDateTime postedAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.lecturerId = lecturerId;
        this.departmentId = departmentId;
        this.postedAt = postedAt;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = postedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getLecturerId() {
        return lecturerId;
    }

    public void setLecturerId(Long lecturerId) {
        this.lecturerId = lecturerId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
}
