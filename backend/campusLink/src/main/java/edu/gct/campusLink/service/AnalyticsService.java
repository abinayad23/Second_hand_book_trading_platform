package edu.gct.campusLink.service;

import java.util.Map;

public interface AnalyticsService {
    Map<String, Long> getPlatformStats();
    Map<String, Long> getDailyActivity();
}